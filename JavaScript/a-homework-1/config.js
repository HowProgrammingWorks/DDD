"use strict";

const config = {
  ports: {
    api: 8001,
    static: 8000,
  },
  transport: "http",
  db: {
    host: "127.0.0.1",
    port: 5432,
    database: "example",
    user: "ubuntu",
    password: "ubuntu",
  },
};

module.exports = config;
