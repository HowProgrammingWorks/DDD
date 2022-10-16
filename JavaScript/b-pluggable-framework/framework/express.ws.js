"use strict";

const express = require("express");

module.exports = (routing, port, console) => {
  const app = express();
  const expressWs = require("express-ws")(app);

  app.ws("*", function (connection, req) {
    const ip = req.socket.remoteAddress;
    connection.on("message", async (message) => {
      const obj = JSON.parse(message);
      const { name, method, args = [] } = obj;
      const entity = routing[name];
      if (!entity) return connection.send('"Not found"', { binary: false });
      const handler = entity[method];
      if (!handler) return connection.send('"Not found"', { binary: false });
      const json = JSON.stringify(args);
      const parameters = json.substring(1, json.length - 1);
      console.log(`${ip} ${name}.${method}(${parameters})`);
      try {
        const result = await handler(...args);
        connection.send(JSON.stringify(result), { binary: false });
      } catch (err) {
        console.error(err);
        connection.send('"Server error"', { binary: false });
      }
    });
  });

  app.listen(port, () => {
    console.log(`Express WS API on port ${port}`);
  });
};
