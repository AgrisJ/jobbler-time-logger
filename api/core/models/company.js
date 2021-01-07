const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    telephone: {type: String, required: true},
    contact: {
        type: new Schema({
            name: {type: String, required: true},
            telephone: {type: String, required: true},
            address: {type: String, required: true}
        }),
        required: true
    }
});

const Company = mongoose.model('Company', schema);

module.exports = Company;