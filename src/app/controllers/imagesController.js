const envConfig = require('../../../config/env');
require('dotenv').config(envConfig);

var Image = require('../models/image');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var multer = require('multer');
var tinify = require("tinify");
tinify.key = process.env.TINIFY_KEY;

let upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = path.join(__dirname, `../../../uploads/images/${req.body.parentId}`);
            try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            } catch (err) {
                console.log('>>>', err);
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            var originalFileName = file.originalname;
            var fileName = crypto.createHash('md5').update(file.originalname + new Date().toISOString()).digest('hex') + '.' + originalFileName.split('.')[1];
            cb(null, fileName);
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            req.fileValidationError = 'O formato do arquivo enviado não é permitido.';
            return cb(null, false, new Error('O formato do arquivo enviado não é permitido.'));
        }
    }
})

// Display list of all Images.
exports.imageList = function (req, res) {
    Image.find()
        .sort({
            'description': 'asc'
        })
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

// Display detail page for a specific image.
exports.imageDetail = function (req, res) {
    Image.find({
            _id: req.params.id
        })
        .exec()
        .then(doc => {
            res.status(200).json({
                data: doc
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Imagem não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao buscar a imagem!',
                    success: false,
                    error: err
                });
            }
        });
};

// Handle image create on POST.
exports.imageCreate = function (req, res) {
    upload.single('file')(req, res, (err) => {
        if (req.fileValidationError) {
            return res.status(500).json({
                message: req.fileValidationError,
                success: false
            });
        }
        if (!err) {
            var source = tinify.fromFile(req.file.path);
            source.toFile(req.file.path);
            try {
                const filePath = req.file.path.substring(req.file.path.indexOf('/uploads') + 1);
                var image = new Image({
                    description: req.body.description,
                    fileName: req.file.filename,
                    filePath
                })
                image.save().then(result => {
                    res.status(200).json({
                        message: 'Imagem criada com sucesso!',
                        success: true,
                        result: result
                    });
                }).catch(err => {
                    res.status(500).json({
                        message: 'Ocorreu um erro ao salvar a imagem!',
                        success: false,
                        error: err
                    });
                });
            } catch (error) {
                res.status(500).json({
                    message: 'Ocorreu um erro ao criar a imagem!',
                    success: false,
                    error
                });
            }
        } else {
            return res.status(500).json({
                message: 'Arquivo inválido!',
                success: false,
                error: err
            });
        }
    })
};

// Handle image disable on POST.
exports.imageRemove = function async (req, res) {
    fs.unlink(path.join(__dirname, `../../../${req.body.filePath}`), (err) => {
        if (!err) {
            const folderPath = path.join(__dirname, `../../../${req.body.filePath.split('/')[2]}`);
            fs.readdir(folderPath, function (err, files) {
                if (!err) {
                    if (!files.length) {
                        fs.rmdir(folderPath, (err) => {                    
                            if (err) {
                                console.log('ERROR >> fs.rmdir', err);
                            }
                        });
                    }
                }
            });
            Image.deleteOne({
                    _id: req.params.id
                })
                .then(result => {
                    res.status(200).json({
                        message: 'Imagem excluida com sucesso!',
                        success: true
                    });
                })
                .catch(err => {
                    if (err.kind === 'ObjectId') {
                        res.status(404).json({
                            message: 'Imagem não encontrada.',
                            success: false,
                            error: err
                        });
                    } else {
                        res.status(500).json({
                            message: 'Ocorreu um erro ao excluir a imagem!',
                            success: false,
                            error: err
                        });
                    }
                })
        } else {
            res.status(500).json({
                message: 'Ocorreu um erro ao excluir a imagem!',
                success: false,
                error: err
            });
        }
    })
};

// Handle image update on POST.
exports.imageUpdate = function (req, res) {
    var image = {
        description: req.body.description
    };
    Image.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: image
        }, {
            new: true
        })
        .then(result => {
            res.status(200).json({
                message: 'Imagem atualizada com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Imagem não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar a imagem!',
                    success: false,
                    error: err
                });
            }
        })
};