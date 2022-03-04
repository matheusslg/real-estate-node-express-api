var Location = require('../models/location');

// Display list of all Categories.
exports.locationList = function (req, res) {
    let body = {};
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    Location.find(body)
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

// Display detail page for a specific location.
exports.locationDetail = function (req, res) {
    Location.findOne({ _id: req.params.id })
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
                    message: 'Localização não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao buscar a localização!',
                    success: false,
                    error: err
                });
            }
        });
};

// Handle location create on POST.
exports.locationCreate = function (req, res) {
    var location = new Location({
        description: req.body.description,
        slugType: req.body.slugType
    })
    location.save().then(result => {
        res.status(200).json({
            message: 'Localização criada com sucesso!',
            success: true,
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Ocorreu um erro ao salvar a localização!',
            success: false,
            error: err
        });
    });
};

// Handle location disable on POST.
exports.locationDisable = function (req, res) {
    Location.findOneAndUpdate({ _id: req.params.id }, { $set: { active: false }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Localização desativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Localização não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao desativar a localização!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle location enable on POST.
exports.locationEnable = function (req, res) {
    Location.findOneAndUpdate({ _id: req.params.id }, { $set: { active: true }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Localização reativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Localização não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao reativar a localização!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle location update on POST.
exports.locationUpdate = function (req, res) {
    var location = {
        description: req.body.description,
        slugType: req.body.slugType
    };
    Location.findOneAndUpdate({ _id: req.params.id }, { $set: location }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Localização atualizada com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Localização não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar a localização!',
                    success: false,
                    error: err
                });
            }
        })
};