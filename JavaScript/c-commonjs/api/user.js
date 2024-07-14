'use strict';

const common = { hash: require('../hash.js') };
const db = require('../db.js');
const users = db.crud('users');

module.exports = {
  async read(id) {
    return await users.read(id, ['id', 'login']);
  },

  async create({ login, password }) {
    const passwordHash = await common.hash(password);
    return await users.create({ login, password: passwordHash });
  },

  async update(id, { login, password }) {
    const passwordHash = await common.hash(password);
    return await users.update(id, { login, password: passwordHash });
  },

  async delete(id) {
    return await users.delete(id);
  },

  async find(mask) {
    const sql = 'SELECT login from users where login like $1';
    return await users.query(sql, [mask]);
  },
};
