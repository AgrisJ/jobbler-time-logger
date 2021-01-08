const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    token: {type: String, required: true},
    // Time to live, how long this token will be active
    ttl: {type: Number, required: true}
});

const Session = mongoose.model('Session', schema);

module.exports = Session;