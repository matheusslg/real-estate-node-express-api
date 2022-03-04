var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var authMiddleware = require('../middlewares/auth');
var router = express.Router();

// Require controller modules.
var slugTypesController = require('../controllers/slugTypesController');

/// SLUG TYPES ROUTES ///
router.get('/', cors(corsConfig), slugTypesController.slugTypeList);
router.get('/:id', cors(corsConfig), slugTypesController.slugTypeDetail);
router.post('/create', [cors(corsConfig), authMiddleware], slugTypesController.slugTypeCreate);
router.post('/:id/disable', [cors(corsConfig), authMiddleware], slugTypesController.slugTypeDisable);
router.post('/:id/enable', [cors(corsConfig), authMiddleware], slugTypesController.slugTypeEnable);
router.post('/:id/update', [cors(corsConfig), authMiddleware], slugTypesController.slugTypeUpdate);

module.exports = router;