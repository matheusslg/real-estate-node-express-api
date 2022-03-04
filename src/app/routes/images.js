var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var authMiddleware = require('../middlewares/auth');
var router = express.Router();

// Require controller modules.
var imagesController = require('../controllers/imagesController');

/// IMAGES ROUTES ///
router.get('/', cors(corsConfig), imagesController.imageList);
router.get('/:id', cors(corsConfig), imagesController.imageDetail);
router.post('/create', [cors(corsConfig), authMiddleware], imagesController.imageCreate);
router.post('/:id/remove', [cors(corsConfig), authMiddleware], imagesController.imageRemove);
router.post('/:id/update', [cors(corsConfig), authMiddleware], imagesController.imageUpdate);

module.exports = router;