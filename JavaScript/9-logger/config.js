const crypto = require("node:crypto");
module.exports = {
  SERVER_PORT: 8001,
  STATIC_SERVER_PORT: 8000,
  DB_HOST: '127.0.0.1',
  DB_PORT: 5432,
  DB_NAME: 'example',
  DB_USER: 'marcus',
  DB_PASSWORD: 'marcus',
  CRYPTO_SIZE: 16,
  CRYPTO_KEY_LENGTH: 64,
  CRYPTO_ENCODING: 'base64',
}
