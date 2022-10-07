'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const staticServer = require('./static.js');
const db = require('./db.js');
const hash = require('./hash.js');
const logger = require('./logger.js');
const { SERVER_STATIC_PORT, SERVER_API_PORT, API_TRANSPORT } = require("./config");

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
    routing[serviceName] = await require(filePath)(sandbox)
  }

  staticServer('./static', SERVER_STATIC_PORT);

  if (API_TRANSPORT==='http') {
    require('./http.js')(routing, SERVER_API_PORT)
  } else if (API_TRANSPORT==='ws') {
    require('./ws.js')(routing, SERVER_API_PORT)
  }
})();
