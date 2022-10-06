'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const server = {
  http: require('./http.js'),
  ws: require('./ws.js'),
};
const staticServer = require('./static.js');
const load = require('./load.js');
const db = require('./db.js');
const hash = require('./hash.js');
const logger = {
  file: require('./logger.js'),
  pino: require('pino'),
}
const {
  SERVER_PORT,
  STATIC_SERVER_PORT,
  TRANSPORT,
  LOGGER_TYPE
} = require('./config.js');

const sandbox = {
  console: Object.freeze(logger[LOGGER_TYPE]),
  db: Object.freeze(db),
  common: { hash },
  module: {}
};
const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = await load(filePath, sandbox);
  }

  staticServer('./static', STATIC_SERVER_PORT);
  (server[TRANSPORT] || server.ws)(routing, SERVER_PORT);
})();
