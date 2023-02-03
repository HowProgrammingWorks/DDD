const pino = require('pino');
const util = require('node:util');

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { translateTime: 'SYS:dd-mm-yyyy hh:mm', ignore: 'pid,hostname' },
  },
});

class Logger {
  constructor(logger) {
    this.logger = logger;
  }
  log(...args) {
    this.logger.info(util.format(...args));
  }
  error(...args) {
    const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n');
    this.logger.error(msg);
  }
}

module.exports = new Logger(logger);
