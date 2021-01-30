require('./../config');

// Export API function object
api = {
    time: {
        timestamp: require('./time/timestamp')
    },
    utils: {
        log: require('./utils/log'),
        securityLog: require('./utils/securityLog'),
        passwordHash: require('./utils/passwordHash'),
        randomString: require('./utils/randomString')
    },
    validators: {
        isAlphaNumeric: require('./validators/isAlphaNumeric'),
        isDate: require('./validators/isDate'),
        isEmail: require('./validators/isEmail')
    },
    tests: {}
}

module.exports = api;