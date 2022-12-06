'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const staticServer = require('./lib/static.js');
const logger = require('./lib/logger.js');
const common = require('./lib/common.js');
const config = require('./config.js');
const load = require('./lib/load.js')(config.sandbox);
const db = require('./lib/db.js')(config.db);
const transport = require(`./transport/${config.api.transport}.js`);

const sandbox = {
  api: Object.freeze({}),
  db: Object.freeze(db),
  console: Object.freeze(logger),
  common: Object.freeze(common),
  config: Object.freeze(config),
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

  staticServer('./static', config.static.port, logger);
  transport(routing, config.api.port, logger);
})();
