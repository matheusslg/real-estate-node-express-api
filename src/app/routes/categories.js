var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var authMiddleware = require('../middlewares/auth');
var router = express.Router();

// Require controller modules.
var categoriesController = require('../controllers/categoriesController');

/// CATEGORIES ROUTES ///
router.get('/', cors(corsConfig), categoriesController.categoryList);
router.get('/:id', cors(corsConfig), categoriesController.categoryDetail);
router.post('/create', [cors(corsConfig), authMiddleware], categoriesController.categoryCreate);
router.post('/:id/disable', [cors(corsConfig), authMiddleware], categoriesController.categoryDisable);
router.post('/:id/enable', [cors(corsConfig), authMiddleware], categoriesController.categoryEnable);
router.post('/:id/update', [cors(corsConfig), authMiddleware], categoriesController.categoryUpdate);

module.exports = router;