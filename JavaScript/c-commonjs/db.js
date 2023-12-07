'use strict';

const pg = require('pg');

let pool = null;

const init = (options) => {
  pool = new pg.Pool(options);
};

const crud = (table) => ({
  async query(sql, args) {
    const result = await pool.query(sql, args);
    return result.rows;
  },

  async read(id, fields = ['*']) {
    const names = fields.join(', ');
    const sql = `SELECT ${names} FROM ${table}`;
    if (!id) return this.query(sql);
    return this.query(`${sql} WHERE id = $1`, [id]);
  },

  async create({ ...record }) {
    const keys = Object.keys(record);
    const nums = new Array(keys.length);
    const data = new Array(keys.length);
    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      nums[i] = `$${++i}`;
    }
    const fields = '"' + keys.join('", "') + '"';
    const params = nums.join(', ');
    const sql = `INSERT INTO "${table}" (${fields}) VALUES (${params})`;
    return this.query(sql, data);
  },

  async update(id, { ...record }) {
    const keys = Object.keys(record);
    const updates = new Array(keys.length);
    const data = new Array(keys.length);
    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      updates[i] = `${key} = $${++i}`;
    }
    const delta = updates.join(', ');
    const sql = `UPDATE ${table} SET ${delta} WHERE id = $${++i}`;
    data.push(id);
    return this.query(sql, data);
  },

  async delete(id) {
    const sql = 'DELETE FROM ${table} WHERE id = $1';
    return this.query(sql, [id]);
  },
});


module.exports = { init, crud };
