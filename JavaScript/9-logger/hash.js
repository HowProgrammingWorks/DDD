'use strict';

const crypto = require('node:crypto');
const scrypt = require('node:util').promisify(crypto.scrypt);

const hash = async (password) => {
    const salt = crypto.randomBytes(16).toString('base64');
    const result = await scrypt(password, salt, 64);
    return salt + ':' + result.toString('base64');
};

module.exports = hash;