var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

// enable creating new users, if this is false addUser will always fail
var enableUserCreation = false;

// required token for adding new users, super simple bit of security to help avoid unwanted users, 
// anyone with the token can add a user
var userCreationToken = "pmlWoKIm2XSes7jBHdPtl8UtGgiSnn1PW8xMFPQ1N2X5c1uY9fa3Zu3QYNODkpuy";

var userAndPassRegex = /^[a-zA-Z0-9]{7,20}$/;
var nameRegex = /^[a-zA-Z0-9]{1,20}( [a-zA-Z0-9]{1,20}){,4}$/;

router.post('/', function(req, res, next) {
    if (!enableUserCreation || req.token != userCreationToken) {
        res.status(401);
        res.json({message: "User creation not available"});
        return;
    }
    if (!utils.stringRegex(req.body.username, userAndPassRegex)) {
        res.status(422);
        res.json({message: "Invalid username"});
    } else if (!utils.stringRegex(req.body.name, nameRegex)) {
        res.status(422);
        res.json({message: "Invalid name"});
    } else if (!utils.stringRegex(req.body.password, userAndPassRegex)) {
        res.status(422);
        res.json({message: "Invalid password"});
    } else {
        var user = new UserModel();      // create the user
        user.username = req.body.username;
        user.name = req.body.name;
        user.password = req.body.password;
        if (utils.isNumber(req.body.budget))
            user.data.budget = req.body.budget;
        if (utils.isNumber(req.body.assets))
            user.data.assets = req.body.assets;
        if (req.body.userOptions) {
            if (req.body.userOptions.isNotify)
                user.data.userOptions.isNotify = req.body.userOptions.isNotify;
            if (utils.isNumber(req.body.userOptions.notifyTime))
                user.data.userOptions.notifyTime = req.body.userOptions.notifyTime;
            if (req.body.userOptions.isTrack)
                user.data.userOptions.isTrack = req.body.userOptions.isTrack;
        }
        user.save(function(err) {
            if (err) {
                res.status(500);
                res.send(err);
            }
            res.json({message: "user created"});
        });
    }
});

// update the user
router.put('/', function(req, res, next) {
    // check login
    var username = session.user;
    if (!username) {
        res.status(401);
        res.json({message: "not logged in"});
        return;
    }
    UserModel.findOne({'username': username}, function(err, user) {
        if (err) {
            res.status(500);
            res.send(err);
            return;
        }
        if (!user) {
            res.status(404);
            res.json({message: "user not found"});
            return;
        }
        if (req.body.budget)
            user.data.budget = req.body.budget;
        if (req.body.assets)
            user.data.assets = req.body.assets;
        if (req.body.userOptions) {
            if (req.body.userOptions.isNotify)
                user.data.userOptions.isNotify = req.body.userOptions.isNotify;
            if (req.body.userOptions.notifyTime)
                user.data.userOptions.notifyTime = req.body.userOptions.notifyTime;
            if (req.body.userOptions.isTrack)
                user.data.userOptions.isTrack = req.body.userOptions.isTrack;
            user.save(function(err) {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                res.json({message: "user updated"});
            });
        }
    });
});

router.get('/', function(req, res, next) {
    // check login
    var username = session.user;
    if (!username) {
        res.status(401);
        res.json({message: "not logged in"});
        return;
    }
    UserModel.findOne({'username': username}, function(err, user) {
        if (err) {
            res.status(500);
            res.send(err);
            return;
        }
        if (!user) {
            res.status(404);
            res.json({message: "user not found"});
            return;
        }
        user.password = "";
        res.json(user);
    });
});

router.delete('/', function(req, res, next) {
    // check login
    var username = session.user;
    if (!username) {
        res.status(401);
        res.json({message: "not logged in"});
        return;
    }
    UserModel.findOne({'username': username}).remove().exec();
    res.json({message: "user removed"});
});

module.exports = router;