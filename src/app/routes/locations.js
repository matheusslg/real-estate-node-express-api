var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var authMiddleware = require('../middlewares/auth');
var router = express.Router();

// Require controller modules.
var locationsController = require('../controllers/locationsController');

/// LOCATIONS ROUTES ///
router.get('/', cors(corsConfig), locationsController.locationList);
router.get('/:id', cors(corsConfig), locationsController.locationDetail);
router.post('/create', [cors(corsConfig), authMiddleware], locationsController.locationCreate);
router.post('/:id/disable', [cors(corsConfig), authMiddleware], locationsController.locationDisable);
router.post('/:id/enable', [cors(corsConfig), authMiddleware], locationsController.locationEnable);
router.post('/:id/update', [cors(corsConfig), authMiddleware], locationsController.locationUpdate);

module.exports = router;