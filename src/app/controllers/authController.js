const envConfig = require('../../../config/env');
require('dotenv').config(envConfig);

var User = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const expiresTime = 86400;

function generateToken (params = {}) {
    return jwt.sign(params, process.env.SECRET_HASH, {
        expiresIn: expiresTime
    });
}

exports.generateToken = function (params = {}) {
    return jwt.sign(params, process.env.SECRET_HASH, {
        expiresIn: expiresTime
    });
}

exports.authLogin = async function (req, res) {
    var user = await User.findOne({ 'email': req.body.email, 'active': true }).select('+password');

    if (!user) {
        return res.status(400).json({
            message: 'Usuário não encontrado.',
            success: false
        });
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).json({
            message: 'Senha inválida.',
            success: false
        });
    }

    user.password = undefined;

    res.status(200).json({
        data: user,
        token: generateToken({ id: user.id, isAdmin: user.isAdmin })
    });
};

exports.passwordRecover = async function(req, res) {
    if (!req.body.email) {
        return res.status(400).json({
            message: 'E-mail não identificado.',
            success: false
        });
    }

    var user = await User.findOne({ 'email': req.body.email });

    if (!user) {
        return res.status(400).json({
            message: 'Usuário não encontrado.',
            success: false
        });
    }

    // send mandrill e-mail
};