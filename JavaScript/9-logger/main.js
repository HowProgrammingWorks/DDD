'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const staticServer = require('./static.js');
const db = require('./db.js');
const hash = require('./hash.js');
const { SERVER_STATIC_PORT, SERVER_API_PORT, API_TRANSPORT, LOGGER} = require("./config");

const loggers = {
  node: () => console,
  fs: () => require('./logger.js'),
  pino: () => require('pino')()
}

const transports = {
  http: (routing, port) => require('./http.js')(routing, port),
  ws: (routing, port) => require('./ws.js')(routing, port),
}

const sandbox = {
  console: Object.freeze(loggers[LOGGER]()),
  db: Object.freeze(db),
  common: { hash },
};
const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = await require(filePath)(sandbox)
  }

  staticServer('./static', SERVER_STATIC_PORT);

  transports[API_TRANSPORT](routing, SERVER_API_PORT)
})();
