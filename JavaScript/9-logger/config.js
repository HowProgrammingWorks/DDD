module.exports = {
  transport: 'ws', // ws | http
  apiPort: 8001,
  staticPort: 8000,
  staticPath: './static',
  logPath: './log',
  db: {
    host: '127.0.0.1',
    port: 5432,
    database: 'example',
    user: 'marcus',
    password: 'marcus',
  },
};
