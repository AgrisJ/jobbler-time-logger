const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    projectId: {type: Schema.Types.ObjectId, required: true},
    companyId: {type: Schema.Types.ObjectId, required: true},
    hours: {type: Number, required: true, min:0},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    breakTime: {type: Number, default: 0},
    notes: {type: String}
}, {
    timestamps: true
});

const Timecard = mongoose.model('Timecard', schema);

module.exports = Timecard;