const express = require('express');
const bp = require('body-parser');
const router = express.Router();
const app = express();

console.log('Express API Started!');

// Require controller modules.
var connectionController = require('../controllers/connectionController');

// MONGODB START CONNECTION ///
connectionController.startConnection();

// body parser
app.use(bp.urlencoded({ extended: true }))

// home
router.get('/', function(req, res) {
  res.send('Real Estate API v1');
});

module.exports = router;
