'use strict';
const { db } = require('../api.di.container');
const { console } = require('../api.di.container');

const country = db('country');

module.exports = {
    async read(id) {
        console.log({ db });
        return await country.read(id);
    },

    async find(mask) {
        const sql = 'SELECT * from country where name like $1';
        return await country.query(sql, [mask]);
    },
};