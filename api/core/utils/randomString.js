const cryptoRandomString = require('crypto-random-string');

function randomString(length) {
    return cryptoRandomString({length: length, type: 'alphanumeric'});
}

module.exports = randomString;