'use strict';

module.exports = {
  static: {
    port: 8000,
  },
  api: {
    port: 8001,
  },
  sandbox: {
    timeout: 5000,
    displayErrors: false,
  },
  db: {
    host: '127.0.0.1',
    port: 5432,
    database: 'example',
    user: 'marcus',
    password: 'marcus',
  },
};
