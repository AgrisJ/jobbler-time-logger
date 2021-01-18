const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    session: {type: String, required: true, minLength: 64, maxLength: 64},
    token: {type: String, required: true, minLength: 64, maxLength: 64},
    // Time to live (how long this session will be active)
    ttl: {type: Number, required: true},
    active: {type: Boolean, default: true}
}, {
    timestamps: true
});

const Session = mongoose.model('Session', schema);

module.exports = Session;