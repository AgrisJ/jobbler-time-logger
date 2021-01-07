const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
    // ...
});

const Project = mongoose.model('Project', schema);

module.exports = Project;