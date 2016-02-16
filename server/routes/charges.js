var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

router.post('/', function(req, res, next) {
    res.json({message: "API Endpoint not implemented"});
});

router.put('/', function(req, res, next) {
    res.json({message: "API Endpoint not implemented"});
});

router.get('/', function(req, res, next) {
    res.json({message: "API Endpoint not implemented"});
});

router.delete('/', function(req, res, next) {
    res.json({message: "API Endpoint not implemented"});
});

module.exports = router;