const envConfig = require('../../../config/env');
require('dotenv').config(envConfig);

const mongoose = require('mongoose');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASS;
const server = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_NAME;

var startConnection = function () {
    mongoose.connect("mongodb://" + (username ? username + ":" : "") + (password ? password + "@" : "") + server + ":" + port + "/" + db, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = {
    startConnection: startConnection
}