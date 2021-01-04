const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    token: {
        type: String,
        minLength: 32,
        maxLength: 32,
        required: true
    },
    ttl: {
        type: Number,
        required: true
    }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

/*_id = sessionId
userId
refreshedAt = updatedAt
token*/ // changes at every request execution