const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, select: false },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'O endereço de e-mail é obrigatório.',
        validate: [validateEmail, 'Por favor, preencha o campo com um e-mail válido.'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, preencha o campo com um e-mail válido.']
    },
    description: String,
    createdAt: String,
    updatedAt: String,
    isAdmin: { type: Boolean, default: false },
    active: { type: Boolean, default: true }
}, { collection: 'users' })

UserSchema.plugin(mongooseUniqueValidator);

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

const User = mongoose.model('user', UserSchema);

module.exports = User;