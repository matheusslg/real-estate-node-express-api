var express = require('express');
var cors = require('cors');
var corsConfig = require('../controllers/corsController');
var router = express.Router();

// Require controller modules.
var authController = require('../controllers/authController');

/// AUTH ROUTES ///
router.post('/login', cors(corsConfig), authController.authLogin);

module.exports = router;