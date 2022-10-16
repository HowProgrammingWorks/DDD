'use strict';

const express = require('express');
const { HEADERS } = require('../constants.js');

module.exports = (routing, port, console) => {
    const app = express()

    app.use(express.json())

    app.use((req, res, next) => {
        const HeaderKeys = Object.keys(HEADERS);

        for (const key of HeaderKeys) {
            res.setHeader(key, HEADERS[key]);
        }

        next();
    })

    for (const name in routing) {
        const entity = routing[name];
        for (const method in entity) {
            const handler = entity[method];
            app.post(`/api/${name}/${method}`, async (req, res) => {
                const { args } = req.body;
                console.log(`${req.ip} ${method} /api/${name}/${method}`);
                const result = await handler(args);
                res.send(result);
            });
        }
    }

    app.listen(port, () => {
        console.log(`Express API on port ${port}`);
    })
};