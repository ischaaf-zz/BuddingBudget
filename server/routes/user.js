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
var userAndPassRegex = /^[a-zA-Z0-9]{5,20}$/;
var nameRegex = /^[a-zA-Z0-9 ]{2,20}$/;

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
    params.entries["username"] = utils.validateString(true, req.body.username, userAndPassRegex, true);
    params.entries["name"]     = utils.validateString(true, req.body.name, nameRegex);
    params.entries["password"] = utils.validateString(true, req.body.password, userAndPassRegex);
    var data;
    if (req.body.data) {
        console.log("Setting Initial User Data");
        data = req.body.data;
    } else {
        console.log("No Initial Data Provided");
        data = {};
    }
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
        user.data.endDate = utils.validateDate(false, data.endDate).value.getTime();
        user.data.assets = Number(data.assets);
        user.data.rollover = Number(data.rollover);
        user.data.tomorrowRollover = Number(data.tomorrowRollover);
        data.options.notifyMorningTime = utils.validateDate(false, data.options.notifyMorningTime).value.getTime();
        data.options.notifyNightTime = utils.validateDate(false, data.options.notifyNightTime).value.getTime();
        user.data.options = data.options;

        if (data.income) {
            for (var i = 0; i < data.income.length; i++) {
                data.income[i].amount = Number(data.income[i].amount);
                data.income[i].start = utils.validateDate(false, data.income[i].start).value.getTime();
            }
            user.data.income = data.income;
        }

        if (data.charges) {
            for (var i = 0; i < data.charges.length; i++) {
                data.charges[i].amount = Number(data.charges[i].amount);
                data.charges[i].start = utils.validateDate(false, data.charges[i].start).value.getTime();
            }
            user.data.charges = data.charges;
        }

        if (data.savings) {
            for (var i = 0; i < data.savings.length; i++) {
                data.savings[i].amount = Number(data.savings[i].amount);
            }
            user.data.savings = data.savings;
        }

        if (data.trackedEntry) {
            data.trackedEntry.budget = Number(data.trackedEntry.budget);
            data.trackedEntry.amount = Number(data.trackedEntry.amount);
            data.trackedEntry.day = utils.validateDate(false, data.trackedEntry.day).value.getTime();
            user.data.entries = [data.trackedEntry];
        }
        
        console.log(user);
        user.save(function(err) {
            if (err) {
                res.status(500).send(err);
            }
            res.json({message: "Success", lastModified: date});
        });
    }
});

// update the user's name or password
router.put('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
        var params = new utils.Parameters();
        params.entries["username"]    = utils.validateString(true, req.body.username, userAndPassRegex, true);
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
        user.password = '*****';
        var mode = utils.validateString(false, req.query.mode);
        if (mode.valid) {
            if (mode.value == 'full') {
                res.json(user);
                return;
            } else if (mode == 'fullSingleTrack') {
                var last = user.data.entries[user.entries.length - 1];
                user.data.entries = [];
                user.data.entries.push(last);
                res.json(user);
                return;
            }
        }
        user.data.savings = [];
        user.data.income = [];
        user.data.entries = [];
        user.data.charges = [];
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