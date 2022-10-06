'use strict';

const { HASH_SALT_SIZE, HASH_SIZE } = require('./config');
const crypto = require('node:crypto');

const hash = (password) => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(HASH_SALT_SIZE).toString('base64');
  crypto.scrypt(password, salt, HASH_SIZE, (err, result) => {
    if (err) reject(err);
    resolve(salt + ':' + result.toString('base64'));
  });
});

module.exports = hash;
