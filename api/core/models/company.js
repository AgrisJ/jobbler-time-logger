const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, required: true, minLength: 5, maxLength: 255},
    address: {type: String, required: true, minLength: 5, maxLength: 255},
    telephone: {type: String, required: true, minLength: 8, maxLength: 255},
    contact: {
        type: new Schema({
            name: {type: String, required: true, minLength: 5, maxLength: 255},
            telephone: {type: String, required: true, minLength: 8, maxLength: 255},
            address: {type: String, required: true, minLength: 5, maxLength: 255}
        }),
        required: true
    }
}, {
    timestamps: true
});

const Company = mongoose.model('Company', schema);

module.exports = Company;