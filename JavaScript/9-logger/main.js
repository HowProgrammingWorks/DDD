'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const staticServer = require('./static.js');
const db = require('./db.js');
const hash = require('./hash.js');
const { SERVER_STATIC, SERVER_API, LOGGER, DB} = require("./config");

const loggers = {
  node: () => console,
  fs: () => require('./logger.js'),
  pino: () => require('pino')()
}

const sandbox = {
  console: Object.freeze(loggers[LOGGER]()),
  db: Object.freeze(db(DB)),
  common: { hash },
};

const transports = {
  http: (routing, port) => require('./transports/http.js')({ routing, port, console: sandbox.console }),
  ws: (routing, port) => require('./transports/ws.js')({ routing, port, console: sandbox.console }),
}

const routing = {};

(async () => {
  const apiPath = path.join(process.cwd(), SERVER_API.PATH);
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = await require(filePath)(sandbox)
  }

  staticServer({
    root: path.join(process.cwd(), SERVER_STATIC.PATH),
    port: SERVER_STATIC.PORT,
    console: sandbox.console
  });

  transports[SERVER_API.TRANSPORT](routing, SERVER_API.PORT)
})();
