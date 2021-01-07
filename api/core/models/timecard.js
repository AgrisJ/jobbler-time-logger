const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
    // ...
});

const Timecard = mongoose.model('Timecard', schema);

module.exports = Timecard;