var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var authMiddleware = require('../middlewares/auth');
var router = express.Router();

// Require controller modules.
var propertiesController = require('../controllers/propertiesController');

// MODELS ///
require('../models/category');
require('../models/location');
require('../models/type');
require('../models/image');
require('../models/file');
require('../models/user');
require('../models/tag');

/// PROPERTY ROUTES ///
router.get('/', cors(corsConfig), propertiesController.propertyList);
router.get('/filter', cors(corsConfig), propertiesController.propertiesFilter);
router.get('/:id', cors(corsConfig), propertiesController.propertyDetail);
router.get('/category/:id', cors(corsConfig), propertiesController.propertiesByCategory);
router.get('/location/:id', cors(corsConfig), propertiesController.propertiesByLocation);
router.get('/type/:id', cors(corsConfig), propertiesController.propertiesByType);
router.get('/city/:id', cors(corsConfig), propertiesController.propertiesByCity);
router.post('/create', [cors(corsConfig), authMiddleware], propertiesController.propertyCreate);
router.post('/:id/disable', [cors(corsConfig), authMiddleware], propertiesController.propertyDisable);
router.post('/:id/remove', [cors(corsConfig), authMiddleware], propertiesController.propertyRemove);
router.post('/:id/enable', [cors(corsConfig), authMiddleware], propertiesController.propertyEnable);
router.post('/:id/update', [cors(corsConfig), authMiddleware], propertiesController.propertyUpdate);
router.post('/:id/updateImages', [cors(corsConfig), authMiddleware], propertiesController.propertyImagesUpdate);

module.exports = router;