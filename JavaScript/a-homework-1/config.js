"use strict";

const config = {
  domain: "localhost",
  ports: {
    api: 8001,
    static: 8000,
  },
  transport: "ws",
  db: {
    host: "127.0.0.1",
    port: 5432,
    database: "example",
    user: "ubuntu",
    password: "ubuntu",
  },
};

module.exports = config;
