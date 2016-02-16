var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

router.post('/', function(req, res, next) {
    // check if user is already logged in, if so do nothing
    if (session.user) {
        res.json({message: "Already logged in", user: session.user});
        return;
    }

    // check for username and password
    var username = req.body.username;
    var pass = req.body.password;

    if (!username || !pass) {
        res.status(422);
        res.json({message: "missing parameters"});
        return;
    }

    // search for user
    UserModel.findOne({'username': username, 'password': pass}, function(err, user) {
        if (!user) {
            res.status(401)
            res.json({message: "Incorrect username or password"});
            return;
        }
        session.user = user.username;
        res.json({message: "logged in"});
    });
});

module.exports = router;