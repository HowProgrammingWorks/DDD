'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const staticServer = require('./static.js');
const logger = require('./logger.js');
const config = require('./config.js');
require('./db.js').init(config.db);
const transport = require(`./transport/${config.api.transport}.js`);

const apiPath = path.join(process.cwd(), './api');
const routing = {};

const main = async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = require(filePath);
  }

  staticServer('./static', config.static.port, logger);
  transport(routing, config.api.port, logger);
};

main();
