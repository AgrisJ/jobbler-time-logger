const crypto = require('crypto');

function passwordHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = passwordHash;