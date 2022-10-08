module.exports = {
  DB: {
    HOST: '127.0.0.1',
    PORT: 5432,
    NAME: 'example',
    USER: 'marcus',
    PASSWORD: 'marcus',
  },

  SERVER_STATIC: {
    PORT: 8000,
    PATH: '/static'
  },

  SERVER_API: {
    PORT: 8001,
    // ws / http
    TRANSPORT: 'http',
    PATH: '/api'
  },

  // node / fs / pino
  LOGGER: 'fs'
}
