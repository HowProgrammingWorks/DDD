'use strict';

const crypto = require('node:crypto');
const {
  CRYPTO_SIZE,
  CRYPTO_KEY_LENGTH,
  CRYPTO_ENCODING,
} = require('./config')

const hash = (password) => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(CRYPTO_SIZE).toString(CRYPTO_ENCODING);
  crypto.scrypt(password, salt, CRYPTO_KEY_LENGTH, (err, result) => {
    if (err) reject(err);
    resolve(salt + ':' + result.toString(CRYPTO_ENCODING));
  });
});

module.exports = hash;
