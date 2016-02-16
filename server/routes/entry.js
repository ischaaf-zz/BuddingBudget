var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

router.post('/', function(req, res, next) {

    var username = session.user;

    if (!username) {
        res.json({message: "not logged in"});
        return;
    }

    // check the parameters
    var budget = req.body.budget;
    var spent = req.body.spent;
    var year = req.body.year;
    var month = req.body.month;
    var day = req.body.day;
    if (!budget || !spent || !year || !month || !day) {
        res.status(422);
        res.json({message: "Missing parameters -- check API reference for required parameters"});
        return;
    }

    UserModel.findOne({'username': username}, function(err, user) {
        if (err) {
            res.status(500);
            res.json(err);
        }
        if (!user) {
            res.status(401);
            res.json({message: "user not found"});
            return;
        }
        console.log(user);
        user.data.entries.push({budget: budget, spent: spent, date: new Date(year, month, day)});
        user.save(function(err) {
            if (err)
                res.json(err);
            res.json({message: "entry added successfully"});
        });
    });
});

router.put('/', function(req, res, next) {
    var username = session.user;

    if (!username) {
        res.json({message: "not logged in"});
        return;
    }

    // check the parameters
    var year = req.body.year;
    var month = req.body.month;
    var day = req.body.day;
    if (!year || !month || !day) {
        res.status(422);
        res.json({message: "Missing parameters -- check API reference for required parameters"});
        return;
    }

    UserModel.findOne({'username': username}, function(err, user) {
        if (err) {
            res.status(500);
            res.json(err);
        }
        if (!user) {
            res.status(401);
            res.json({message: "user not found"});
            return;
        }
        var date = new Date(year, month, day);
        var i = findEntry(user, date);
        if (i) {
            if (req.body.budget)
                user.data.entries[i].budget = req.body.budget;
            if (req.body.spent)
                user.data.entries[i].spent = req.body.spent;
        } else {
            res.status(401);
            res.json({message: "no entry found"});
            return;
        }
        user.save(function(err) {
            if (err)
                res.json(err);
            res.json({message: "entry added successfully"});
        });
    });
});

router.get('/', function(req, res, next) {
    res.json({message: "API Endpoint not implemented"});
})

router.delete('/', function(req, res, next) {
    res.json({message: "API Endpoint not implemented"});
});

function findEntry(user, date) {
    for (var i in user.data.entries) {
        if (user.data.entries[i].date == date)
            return i;
    }
    return false;
}

module.exports = router;