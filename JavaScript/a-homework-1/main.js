'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const config = require('./config.js');
const transport = require(`./transport/${config.api.transport}.js`);
const staticServer = require('./static.js');
const db = require('./db.js')(config.db);
const hash = require('./hash.js');
const logger = require(`./loggers/${config.logger}.js`);

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
    routing[serviceName] = require(filePath)(sandbox);
  }
  staticServer('./static', config.static.port, logger);
  transport(routing, config.api.port, logger);
})();
