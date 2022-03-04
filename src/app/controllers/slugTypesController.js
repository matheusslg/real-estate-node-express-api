var SlugType = require('../models/slugType');

// Display list of all SlugTypes.
exports.slugTypeList = function (req, res) {
    let body = {};
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    SlugType.find(body)
        .sort({'description': 'asc'})
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

// Display detail page for a specific slugType.
exports.slugTypeDetail = function (req, res) {
    SlugType.findOne({ _id: req.params.id })
        .exec()
        .then(doc => {
            res.status(200).json({
                data: doc
            });
        })
        .catch(err => { 
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Slug não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao buscar o slug!',
                    success: false,
                    error: err
                });
            }
        });
};

// Handle slugType create on POST.
exports.slugTypeCreate = function (req, res) {
    var slugType = new SlugType({
        description: req.body.description,
        slug: req.body.slug,
        type: req.body.type,
        showOnApp: req.body.showOnApp
    })
    slugType.save().then(result => {
        res.status(200).json({
            message: 'Slug criado com sucesso!',
            success: true,
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Ocorreu um erro ao salvar o slug!',
            success: false,
            error: err
        });
    });
};

// Handle slugType disable on POST.
exports.slugTypeDisable = function (req, res) {
    SlugType.findOneAndUpdate({ _id: req.params.id }, { $set: { active: false }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Slug desativado com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Slug não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao desativar o slug!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle slugType enable on POST.
exports.slugTypeEnable = function (req, res) {
    SlugType.findOneAndUpdate({ _id: req.params.id }, { $set: { active: true }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Slug reativado com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Slug não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao reativar o slug!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle slugType update on POST.
exports.slugTypeUpdate = function (req, res) {
    var slugType = {
        description: req.body.description,
        slug: req.body.slug,
        type: req.body.type,
        showOnApp: req.body.showOnApp
    };
    SlugType.findOneAndUpdate({ _id: req.params.id }, { $set: slugType }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Slug atualizado com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Slug não encontrado.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar o slug!',
                    success: false,
                    error: err
                });
            }
        })
};