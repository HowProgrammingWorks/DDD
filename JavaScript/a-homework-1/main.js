"use strict";

const fsp = require("node:fs").promises;
const path = require("node:path");
const { ports, transport } = require("./config.js");
const server = require(`./${transport}.js`);
const staticServer = require("./static.js");
const load = require("./load.js");
const db = require("./db.js");
const hash = require("./hash.js");
const logger = require("./logger.js");

const sandbox = {
  console: Object.freeze(logger),
  db: Object.freeze(db),
  common: { hash },
};
const apiPath = path.join(process.cwd(), "./api");
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith(".js")) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, ".js");
    routing[serviceName] = await load(filePath, sandbox);
  }

  staticServer("./static", ports.static);
  server(routing, ports.api);
})();
