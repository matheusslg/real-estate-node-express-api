var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var authMiddleware = require('../middlewares/auth');
var router = express.Router();

// Require controller modules.
var tagsController = require('../controllers/tagsController');

/// TAGS ROUTES ///
router.get('/', cors(corsConfig), tagsController.tagList);
router.get('/:id', cors(corsConfig), tagsController.tagDetail);
router.post('/create', [cors(corsConfig), authMiddleware], tagsController.tagCreate);
router.post('/:id/disable', [cors(corsConfig), authMiddleware], tagsController.tagDisable);
router.post('/:id/enable', [cors(corsConfig), authMiddleware], tagsController.tagEnable);
router.post('/:id/update', [cors(corsConfig), authMiddleware], tagsController.tagUpdate);

module.exports = router;