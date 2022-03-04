var Type = require('../models/type');

// Display list of all Categories.
exports.typeList = function (req, res) {
    let body = {};
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    Type.find(body)
        .sort({'description': 'asc'})
        .populate(['slugType'])
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

// Display detail page for a specific type.
exports.typeDetail = function (req, res) {
    Type.findOne({ _id: req.params.id })
        .populate(['slugType'])
        .exec()
        .then(doc => {
            res.status(200).json({
                data: doc
            });
        })
        .catch(err => { 
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Tipo não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao buscar o tipo!',
                    success: false,
                    error: err
                });
            }
        });
};

// Handle type create on POST.
exports.typeCreate = function (req, res) {
    var type = new Type({
        description: req.body.description,
        slugType: req.body.slugType
    })
    type.save().then(result => {
        res.status(200).json({
            message: 'Tipo criado com sucesso!',
            success: true,
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Ocorreu um erro ao salvar o tipo!',
            success: false,
            error: err
        });
    });
};

// Handle type disable on POST.
exports.typeDisable = function (req, res) {
    Type.findOneAndUpdate({ _id: req.params.id }, { $set: { active: false }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Tipo desativado com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Tipo não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao desativar o tipo!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle type enable on POST.
exports.typeEnable = function (req, res) {
    Type.findOneAndUpdate({ _id: req.params.id }, { $set: { active: true }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Tipo reativado com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Tipo não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao reativar o tipo!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle type update on POST.
exports.typeUpdate = function (req, res) {
    var type = {
        description: req.body.description,
        slugType: req.body.slugType
    };
    Type.findOneAndUpdate({ _id: req.params.id }, { $set: type }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Tipo atualizado com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Tipo não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar o tipo!',
                    success: false,
                    error: err
                });
            }
        })
};