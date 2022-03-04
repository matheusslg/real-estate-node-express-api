var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var authMiddleware = require('../middlewares/auth');
var router = express.Router();

// Require controller modules.
var usersController = require('../controllers/usersController');

/// PROPERTY ROUTES ///
router.get('/', cors(corsConfig), usersController.userList);
router.get('/:id', cors(corsConfig), usersController.userDetail);
router.post('/create', [cors(corsConfig), authMiddleware], usersController.userCreate);
router.post('/:id/disable', [cors(corsConfig), authMiddleware], usersController.userDisable);
router.post('/:id/enable', [cors(corsConfig), authMiddleware], usersController.userEnable);
router.post('/:id/update', [cors(corsConfig), authMiddleware], usersController.userUpdate);

module.exports = router;