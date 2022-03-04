var Category = require('../models/category');

// Display list of all Categories.
exports.categoryList = function (req, res) {
    let body = {};
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    Category.find(body)
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

// Display detail page for a specific category.
exports.categoryDetail = function (req, res) {
    Category.findOne({ _id: req.params.id })
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
                    message: 'Categoria não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao buscar a categoria!',
                    success: false,
                    error: err
                });
            }
        });
};

// Handle category create on POST.
exports.categoryCreate = function (req, res) {
    var category = new Category({
        description: req.body.description,
        slugType: req.body.slugType
    })
    category.save().then(result => {
        res.status(200).json({
            message: 'Categoria criada com sucesso!',
            success: true,
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Ocorreu um erro ao salvar a categoria!',
            success: false,
            error: err
        });
    });
};

// Handle category disable on POST.
exports.categoryDisable = function (req, res) {
    Category.findOneAndUpdate({ _id: req.params.id }, { $set: { active: false }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Categoria desativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Categoria não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao desativar a categoria!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle category enable on POST.
exports.categoryEnable = function (req, res) {
    Category.findOneAndUpdate({ _id: req.params.id }, { $set: { active: true }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Categoria reativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Categoria não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao reativar a categoria!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle category update on POST.
exports.categoryUpdate = function (req, res) {
    var category = {
        description: req.body.description,
        slugType: req.body.slugType
    };
    Category.findOneAndUpdate({ _id: req.params.id }, { $set: category }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Categoria atualizada com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Categoria não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar a categoria!',
                    success: false,
                    error: err
                });
            }
        })
};