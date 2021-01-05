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
    ttl: { // Time to live
        type: Number,
        required: true
    }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;