'use strict';
const { WebTransport } = require('./constants.js');

const config = {
    // Database connection information
    dbHostIp: process.env.DB_HOST_IP || '127.0.0.1',
    dbPort: process.env.DB_PORT || 5432,
    dbName: process.env.DB_NAME || 'example',
    dbUser: process.env.DB_USER || 'marcus',
    dbPassword: process.env.DB_PASSWORD || 'marcus',

    // Application server settings
    appServerPort: process.env.APP_SERVER_PORT || 8001,
    appStaticServerPort: process.env.APP_STATIC_SERVER_PORT || 8000,
    appWebTransport: process.env.APP_WEB_TRANSPORT || WebTransport.HTTP,
}

module.exports = config;