var City = require('../models/city');

// Display list of all Cities.
exports.cityList = function (req, res) {
    let body = {};
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    City.find(body)
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

// Display detail page for a specific city.
exports.cityDetail = function (req, res) {
    City.findOne({ _id: req.params.id })
        .exec()
        .then(doc => {
            res.status(200).json({
                data: doc
            });
        })
        .catch(err => { 
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Cidade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao buscar a cidade!',
                    success: false,
                    error: err
                });
            }
        });
};

// Handle city create on POST.
exports.cityCreate = function (req, res) {
    var city = new City({
        description: req.body.description,
        uf: req.body.uf
    })
    city.save().then(result => {
        res.status(200).json({
            message: 'Cidade criada com sucesso!',
            success: true,
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Ocorreu um erro ao salvar a cidade!',
            success: false,
            error: err
        });
    });
};

// Handle city disable on POST.
exports.cityDisable = function (req, res) {
    City.findOneAndUpdate({ _id: req.params.id }, { $set: { active: false }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Cidade desativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Cidade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao desativar a cidade!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle city enable on POST.
exports.cityEnable = function (req, res) {
    City.findOneAndUpdate({ _id: req.params.id }, { $set: { active: true }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Cidade reativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Cidade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao reativar a cidade!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle city update on POST.
exports.cityUpdate = function (req, res) {
    var city = {
        description: req.body.description,
        uf: req.body.uf
    };
    City.findOneAndUpdate({ _id: req.params.id }, { $set: city }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Cidade atualizada com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Cidade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar a cidade!',
                    success: false,
                    error: err
                });
            }
        })
};