var User = require('../models/user');
var authController = require('./authController');
var moment = require('moment');

// Display list of all Users.
exports.userList = function (req, res) {
    User.find()
        .sort({'createdAt': 'desc'})
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length,
                data: doc
            });
        })
        .catch(err => { 
            res.status(500).json({
                message: 'Não foi possível trazer os dados',
                success: false,
                error: err
            });
        });
};

// Display detail page for a specific user.
exports.userDetail = function (req, res) {
    User.findOne({ _id: req.params.id })
        .exec()
        .then(doc => {
            res.status(200).json({
                data: doc
            });
        })
        .catch(err => { 
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Usuário não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao buscar o usuário!',
                    success: false,
                    error: err
                });
            }
        });
};

// Handle user create on POST.
exports.userCreate = function (req, res) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        description: req.body.description,
        createdAt: moment().format(),
        updatedAt: moment().format(),
        isAdmin: req.body.isAdmin
    })
    user.save().then(result => {
        res.status(200).json({
            message: 'Usuário criado com sucesso!',
            success: true,
            data: result,
            token: authController.generateToken({ id: result.id })
        });
    }).catch(err => {
        if (err.errors && err.errors.hasOwnProperty('email')) {
            if (err.errors.email.kind !== 'unique') {
                res.status(500).json({
                    message: err.errors.email.message,
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'O e-mail inserido já existe.',
                    success: false,
                    error: err
                });
            }
        } else {
            res.status(500).json({
                message: 'Ocorreu um erro ao salvar o usuário!',
                success: false,
                error: err
            });
        }
    });
};

// Handle user disable on POST.
exports.userDisable = function (req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, { $set: { active: false }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Usuário desativado com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Usuário não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao desativar o usuário!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle user enable on POST.
exports.userEnable = function (req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, { $set: { active: true }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Usuário reativado com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Usuário não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao reativar o usuário!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle user update on POST.
exports.userUpdate = function (req, res) {
    var user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        description: req.body.description,
        updatedAt: moment().format(),
        isAdmin: req.body.isAdmin
    }
    User.findOneAndUpdate({ _id: req.params.id }, { $set: user }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Usuário atualizado com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Usuário não encontrado.',
                    success: false,
                    error: err
                });
            } else if (err.errors && err.errors.hasOwnProperty('email')) {
                if (!err.errors.email.kind === 'unique') {
                    res.status(500).json({
                        message: err.errors.email.message,
                        success: false,
                        error: err
                    });
                } else {
                    res.status(500).json({
                        message: 'O e-mail inserido já existe.',
                        success: false,
                        error: err
                    });
                }
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar o usuário!',
                    success: false,
                    error: err
                });
            }
        })
};