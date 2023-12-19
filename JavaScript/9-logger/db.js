'use strict';

const pg = require('pg');
const config = require('./config');

const pool = new pg.Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
});

module.exports = (table) => ({
    async query(sql, args) {
        return await pool.query(sql, args);
    },

    async read(id, fields = ['*']) {
        const names = fields.join(', ');
        const sql = `SELECT ${names} FROM ${table}`;
        if (!id) return pool.query(sql);
        return await pool.query(`${sql} WHERE id = $1`, [id]);
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
        const sql = `INSERT INTO "${table}" (${fields}) VALUES (${params}) RETURNING id`;
        return await pool.query(sql, data);
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
        return await pool.query(sql, data);
    },

    async delete(id) {
        const sql = `DELETE FROM ${table} WHERE id = $1`;
        return await pool.query(sql, [id]);
    },
});