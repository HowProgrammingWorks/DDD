module.exports = {
    common: Object.freeze({hash: require('./hash')}),
    db: Object.freeze(require('./db')),
    console: Object.freeze(require('./logger.di.container')),
};