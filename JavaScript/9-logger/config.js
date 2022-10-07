module.exports = {
  DB_HOST: '127.0.0.1',
  DB_PORT: 5432,
  DB_NAME: 'example',
  DB_USER: 'marcus',
  DB_PASSWORD: 'marcus',

  SERVER_STATIC_PORT: 8000,
  SERVER_API_PORT: 8001,

  // ws / http
  API_TRANSPORT: 'http',

  // node / fs / pino
  LOGGER: 'fs'
}
