const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    companyId: {type: Schema.Types.ObjectId, required: true},
    email: {
        type: String,
        required: true,
        unique: true,
        //validate: [require('./../validators/isEmail'), 'invalid email']
        validate: {
            validator: function(value) {
                return api.validators.isEmail(value);
            },
            message: 'invalid email'
        }
    },
    fullName: {type: String, required: true, minLength: 5, maxLength: 64},
    password: {type: String, required: true, minLength: 64, maxLength: 64},
    role: {type: String, enum: ['admin', 'company', 'employee'], required: true},
    telephone: {type: String, minLength: 8, maxLength: 12, required: true},
    cpr: {type: String, minLength: 10, maxLength: 10, required: true},
    contractNumber: {type: String, required: true},
    deleted: {type: Boolean, default: false}
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;