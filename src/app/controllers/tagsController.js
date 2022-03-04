var Tag = require('../models/tag');

// Display list of all Categories.
exports.tagList = function (req, res) {
    let body = {};
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    Tag.find(body)
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

// Display detail page for a specific tag.
exports.tagDetail = function (req, res) {
    Tag.findOne({ _id: req.params.id })
        .exec()
        .then(doc => {
            res.status(200).json({
                data: doc
            });
        })
        .catch(err => { 
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Tag não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao buscar a tag!',
                    success: false,
                    error: err
                });
            }
        });
};

// Handle tag create on POST.
exports.tagCreate = function (req, res) {
    var tag = new Tag({
        description: req.body.description
    })
    tag.save().then(result => {
        res.status(200).json({
            message: 'Tag criada com sucesso!',
            success: true,
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Ocorreu um erro ao salvar a tag!',
            success: false,
            error: err
        });
    });
};

// Handle tag disable on POST.
exports.tagDisable = function (req, res) {
    Tag.findOneAndUpdate({ _id: req.params.id }, { $set: { active: false }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Tag desativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Tag não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao desativar a tag!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle tag enable on POST.
exports.tagEnable = function (req, res) {
    Tag.findOneAndUpdate({ _id: req.params.id }, { $set: { active: true }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Tag reativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Tag não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao reativar a tag!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle tag update on POST.
exports.tagUpdate = function (req, res) {
    var tag = {
        description: req.body.description
    };
    Tag.findOneAndUpdate({ _id: req.params.id }, { $set: tag }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Tag atualizada com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Tag não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar a tag!',
                    success: false,
                    error: err
                });
            }
        })
};