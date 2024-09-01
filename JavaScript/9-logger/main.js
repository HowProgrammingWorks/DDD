'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const staticServer = require('./static.js');
const load = require('./load.js');
const createDbQueryConstructor = require('./db.js');
const hash = require('./hash.js');
const Logger = require('./logger.js');
const config = require('./config.js');
const server = require(`./${config.transport}.js`);

const logger = new Logger(config.logPath);
const db = createDbQueryConstructor(config.db);

const sandbox = {
  console: Object.freeze(logger),
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
    routing[serviceName] = await load(filePath, sandbox);
  }

  staticServer(config.staticPath, config.staticPort, logger);
  server(routing, config.apiPort, logger);
})();
