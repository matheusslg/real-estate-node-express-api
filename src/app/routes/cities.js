var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var authMiddleware = require('../middlewares/auth');
var router = express.Router();

// Require controller modules.
var citiesController = require('../controllers/citiesController');

/// CITIES ROUTES ///
router.get('/', cors(corsConfig), citiesController.cityList);
router.get('/:id', cors(corsConfig), citiesController.cityDetail);
router.post('/create', [cors(corsConfig), authMiddleware], citiesController.cityCreate);
router.post('/:id/disable', [cors(corsConfig), authMiddleware], citiesController.cityDisable);
router.post('/:id/enable', [cors(corsConfig), authMiddleware], citiesController.cityEnable);
router.post('/:id/update', [cors(corsConfig), authMiddleware], citiesController.cityUpdate);

module.exports = router;