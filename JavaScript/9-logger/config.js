module.exports = {
    apiServer: {
        /**
         * @type {string} 'http' | 'ws'
         */
        transport: 'http',
        port: 3000,
    },
    staticServer: {
        port: 8000,
    },
    crypto: {
        saltLenByte: 16,
        scryptLenByte: 64,
    },
    database: {
        host: 'localhost',
        port: 5432,
        database: 'metatech',
        user: 'admin',
        password: 'admin',
    },
    /**
     * @type {string} 'pino' | 'meta'
     */
    logger: 'pino'
};