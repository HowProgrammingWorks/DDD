'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const config = require('./config.js');
const server = require(`./${config.apiServer.transport}.js`);
const staticServer = require('./static.js');
const load = require('./load.js');

const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
    const files = await fsp.readdir(apiPath);
    for (const fileName of files) {
        if (!fileName.endsWith('.js')) continue;
        const filePath = path.join(apiPath, fileName);
        const serviceName = path.basename(fileName, '.js');
        routing[serviceName] = require(filePath);
    }

    staticServer('./static', config.staticServer.port);
    server(routing, config.apiServer.port);
})();
