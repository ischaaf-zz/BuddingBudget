var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

// enable creating new users, if this is false addUser will always fail
var enableUserCreation = true;

// required token for adding new users, super simple bit of security to help avoid unwanted users, 
// anyone with the token can add a user
var userCreationToken = "pmlWoKIm2XSes7jBHdPtl8UtGgiSnn1PW8xMFPQ1N2X5c1uY9fa3Zu3QYNODkpuy";
var userAndPassRegex = /^[a-zA-Z0-9]{1,20}$/;
var nameRegex = /^[a-zA-Z0-9 ]{1,20}$/;

// initial entry point for all requests
router.use(function(req, res, next) {
    console.log(req.method + " /user");
    console.log(req.body);
    next();
});

router.post('/', function(req, res, next) {
    if (!enableUserCreation || req.body.token != userCreationToken) {
        res.status(401);
        res.json({message: "User creation not available"});
        return;
    }

    // check parameters
    var params = new utils.Parameters();
    params.entries["username"] = utils.validateString(true, req.body.username, userAndPassRegex);
    params.entries["name"]     = utils.validateString(true, req.body.name, nameRegex);
    params.entries["password"] = utils.validateString(true, req.body.password, userAndPassRegex);

    if (!params.hasRequired()) {
        var invalid = params.getInvalid();
        res.status(422).json(invalid);
    } else {
        var user = new UserModel();      // create the user
        user.username = params.entries["username"].value;
        user.name = params.entries["name"].value;
        user.password = params.entries["password"].value;
        var date = Date.now();
        user.lastModified = date;
        user.save(function(err) {
            if (err) {
                res.status(500).send(err);
            }
            res.json({message: "Success", modified: date});
        });
    }
});

// update the user's name or password
router.put('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
        var params = new utils.Parameters();
        params.entries["username"]    = utils.validateString(true, req.body.username, userAndPassRegex);
        params.entries["name"]        = utils.validateString(false, req.body.name, nameRegex);
        params.entries["password"]    = utils.validateString(true, req.body.password, userAndPassRegex);
        params.entries["newPassword"] = utils.validateString(false, req.body.password, userAndPassRegex);
        if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else if (username != user.username || password != user.password) {
            res.status(401).json({message: "Username and password incorrect"});
            return false;
        } else {
            if (params.entries["name"].valid) {
                user.name = params.entries["name"].value;
            }
            if (params.entries["newPassword"].valid) {
                user.password = params.entries["newPassword"].value;
            }
            return true;
        }
    });
});

router.get('/', function(req, res, next) {
    utils.getUser(req, res, function(req, res, user) {
        var full = utils.validateBool(false, req.query.getFull);
        if (!full.valid || !full.value) {
            user.data.savings = [];
            user.data.income = [];
            user.data.entries = [];
            user.data.charges = [];
        }
        user.password = "*****";
        res.json(user);
    });
});

router.delete('/', function(req, res, next) {
    // check login
    var username = session.user;
    if (!username) {
        res.status(401).json({message: "not logged in"});
        return;
    }
    UserModel.findOne({'username': username}).remove().exec();
    res.json({message: "user removed"});
});

module.exports = router;