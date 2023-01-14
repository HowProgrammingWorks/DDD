"use strict";

const http = require("node:http");
const { ports, domain } = require("./config.js");

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

module.exports = (routing, port) => {
  http
    .createServer(async (req, res) => {
      const { url, socket, method: httpMethod } = req;
      const [name, method, id] = url.substring(1).split("/");
      const entity = routing[name];
      if (!entity) return res.end("Not found");
      const handler = entity[method];
      if (!handler) return res.end("Not found");
      res.setHeader(
        "Access-Control-Allow-Origin",
        `http://${domain}:${ports.static}`
      );
      res.setHeader("Access-Control-Allow-Methods", `*`);
      res.setHeader("Access-Control-Allow-Headers", ["Content-Type"]);
      if (httpMethod === "OPTIONS") return res.end();
      const src = handler.toString();
      const signature = src.substring(0, src.indexOf(")"));
      const args = [];
      if (signature.includes("(id") || signature.includes("(mask"))
        args.push(id);
      if (signature.includes("{")) args.push(await receiveArgs(req));
      console.log(`${socket.remoteAddress} ${method} ${url}`);
      const result = await handler(...args);
      res.end(JSON.stringify(result.rows));
    })
    .listen(port);

  console.log(`API on port ${port}`);
};
