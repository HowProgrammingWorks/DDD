'use strict';

const pino = require('pino');
const util = require('node:util');
const path = require('node:path');
const fs = require("node:fs");

class Logger {
  constructor(logPath) {
    const date = new Date().toISOString().substring(0, 10);
    const filePath = path.join(logPath, `${date}.log`);
    this.logger = pino.pino(pino.destination(filePath));
  }

  close() {
  }

  log(...args) {
    const msg = util.format(...args);
    this.logger.info(msg);
  }

  dir(...args) {
    const msg = util.inspect(...args);
    this.logger.info(msg);
  }

  debug(...args) {
    const msg = util.format(...args);
    this.logger.debug(msg);
  }

  error(...args) {
    const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n');
    this.logger.error('error', msg.replace(this.regexp, ''));
  }

  system(...args) {
    const msg = util.format(...args);
    this.logger.fatal(msg);
  }

  access(...args) {
    const msg = util.format(...args);
    this.logger.fatal(msg);
  }
}

module.exports = new Logger('./log');
