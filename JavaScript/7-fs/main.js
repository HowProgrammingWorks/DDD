'use strict';

const fsp = require('fs').promises;
const path = require('path');
const server = require('./ws.js');
const staticServer = require('./static.js');

const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = require(filePath);
  }
})();

staticServer('./static', 8000);
server(routing, 8001);
