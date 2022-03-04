var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var authMiddleware = require('../middlewares/auth');
var router = express.Router();

// Require controller modules.
var typesController = require('../controllers/typesController');

/// TYPES ROUTES ///
router.get('/', cors(corsConfig), typesController.typeList);
router.get('/:id', cors(corsConfig), typesController.typeDetail);
router.post('/create', [cors(corsConfig), authMiddleware], typesController.typeCreate);
router.post('/:id/disable', [cors(corsConfig), authMiddleware], typesController.typeDisable);
router.post('/:id/enable', [cors(corsConfig), authMiddleware], typesController.typeEnable);
router.post('/:id/update', [cors(corsConfig), authMiddleware], typesController.typeUpdate);

module.exports = router;