const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    companyId: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true, minLength: 5, maxLength: 255},
    address: {type: String, required: true, minLength: 5, maxLength: 255},
    active: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false}
}, {
    timestamps: true
});

const Project = mongoose.model('Project', schema);

module.exports = Project;