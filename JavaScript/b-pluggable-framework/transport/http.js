"use strict";

const http = require("node:http");
const { HEADERS } = require("../constants.js");

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

const createCleanServer = (routing, port, console) => {
  http
    .createServer(async (req, res) => {
      res.writeHead(200, HEADERS);
      if (req.method !== "POST") return res.end('"Not found"');
      const { url, socket } = req;
      const [place, name, method] = url.substring(1).split("/");
      if (place !== "api") return res.end('"Not found"');
      const entity = routing[name];
      if (!entity) return res.end('"Not found"');
      const handler = entity[method];
      if (!handler) return res.end('"Not found"');
      const { args } = await receiveArgs(req);
      console.log(`${socket.remoteAddress} ${method} ${url}`);
      const result = await handler(args);
      res.end(JSON.stringify(result));
    })
    .listen(port);

  console.log(`API on port ${port}`);
};

module.exports = (routing, port, console, framework) => {
  switch (framework) {
    case "express":
      const express = require("../framework/express.http.js");
      express(routing, port, console);
      break;
    default:
      createCleanServer(routing, port, console);
  }
};
