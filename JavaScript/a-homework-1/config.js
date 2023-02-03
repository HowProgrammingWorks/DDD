'use strict';

const config = {
  domain: 'localhost',
  api: {
    port: 8001,
    transport: 'ws',
  },
  static: {
    port: 8000,
  },
  db: {
    host: '127.0.0.1',
    port: 5432,
    database: 'example',
    user: 'ubuntu',
    password: 'ubuntu',
  },
  logger: 'pino',
};

module.exports = config;
