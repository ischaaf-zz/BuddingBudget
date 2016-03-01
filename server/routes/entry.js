var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

// initial entry point for all requests
router.use(function(req, res, next) {
    console.log(req.method + " /entry");
    console.log(req.body);
    next();
});

router.post('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	var params = new utils.Parameters();
    	params.entries["budget"] = utils.validateNumber(true, req.body.budget, 0);
    	params.entries["amount"] = utils.validateNumber(true, req.body.amount, 0);
    	params.entries["day"]    = utils.validateDate(true, req.body.day, false);
    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).send(invalid);
            return false;
        } else {
	        user.data.entries.push({
	        	budget: params.entries["budget"].value, 
	        	amount: params.entries["amount"].value, 
	        	day: params.entries["day"].value
	        });
	        return true;
    	}
    });
});

router.put('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	var params = new utils.Parameters();
    	params.entries["date"]   = utils.validateDate(true, req.body.day, true);
    	params.entries["budget"] = utils.validateNumber(false, req.body.budget, 0);
    	params.entries["spent"]  = utils.validateNumber(false, req.body.amount , 0);
    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else {
	        var i = findEntry(user, date);
	        if (i) {
	            if (params.entries["budget"].valid)
	                user.data.entries[i].budget = params.entries["budget"].value;
	            if (params.entries["spent"].valid)
	                user.data.entries[i].spent = params.entries["spent"].value;
	            return true
	        } else {
	            res.status(401).json({message: "no entry found with that date"});
	            return false;
	        }
    	}
    });
});

router.get('/', function(req, res, next) {
    utils.getUser(req, res, function(req, res, user) {
    	var date = utils.validateDate(false, req.query.date);
    	if (date.valid) {
    		var i = findEntry(user, date.value);
    		if (i) {
    			res.json(user.data.entries[i]);
    		} else {
    			res.status(404).json({message: "no entry found for that day"});
    		}
    	} else {
    		res.json(user.data.entries);
    	}
    });
})

router.delete('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	var params = new utils.Parameters();
    	params.entries["day"] = utils.validateDate(true, req.body.day);
    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else {
    		var i = findEntry(user, params.entries["day"].value);
    		if (i) {
    			user.data.entries.splice(i, 1);
    			return true;
    		} else {
    			res.status(404).json({message: "no entry found for that day"});
    			return false;
    		}
    	}
    });
});

function findEntry(user, d1) {
    for (var i in user.data.entries) {
        var d2 = new Date(Date.parse(user.data.entries[i].day));
        if (d2.getYear() == d1.getYear() && d2.getMonth() == d1.getMonth() && d2.getDay() == d1.getDay())
            return i;
    }
    return false;
}

module.exports = router;