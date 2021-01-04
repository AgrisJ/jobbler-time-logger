require('./../config');

// Export API function object
api = {
    time: {
        timestamp: require('./time/timestamp')
    },
    utils: {
        log: require('./utils/log'),
        securityLog: require('./utils/securityLog'),
        hashPassword: require('./utils/hashPassword'),
        randomString: require('./utils/randomString')
    },
    validators: {
        isAlphaNumeric: require('./validators/isAlphaNumeric'),
        isEmail: require('./validators/isEmail')
    },
    tests: {}
}

module.exports = api;