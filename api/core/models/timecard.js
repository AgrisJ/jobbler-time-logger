const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    projectId: {type: Schema.Types.ObjectId, required: true},
    date: {type: Date, required: true},
    hours: {type: Number, required: true, min:0}
}, {
    timestamps: true
});

const Timecard = mongoose.model('Timecard', schema);

module.exports = Timecard;