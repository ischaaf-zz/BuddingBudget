var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

// initial entry point for all requests
router.use(function(req, res, next) {
    console.log(req.method + " /savings");
    console.log(req.body);
    next();
});

router.post('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	var params = new utils.Parameters();
    	params.entries["name"] = utils.validateString(true, req.body.name);
    	params.entries["amount"] = utils.validateNumber(true, req.body.amount);
    	params.entries["isDefault"] = utils.validateBool(true, req.body.isDefault);

    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else {
    		user.data.savings.push({
    			name: params.entries["name"].value, 
    			amount: params.entries["amount"].value, 
    			isDefault: params.entries["isDefault"].value
    		});
    		return true;
    	}
    });
});

router.put('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	var params = new utils.Parameters();
    	params.entries["name"] = utils.validateString(req.body.name);
    	params.entries["amount"] = utils.validateNumber(req.body.amount);
    	params.entries["isDefault"] = utils.validateBool(req.body.isDefault);

    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else {
    		var i = findSavings(user, params.entries["name"].value);
    		if (i) {
    			if (params.entries["amount"].valid)
    				user.data.income[i].amount = params.entries["amount"].value;
    			if (params.entries["isDefault"].valid)
    				user.data.income[i].isDefault = params.entries["isDefault"].value;
    			return true;
    		} else {
    			res.status(404).json({message: "no savings entry with that name found"});
    			return false;
    		}
    	}
    });
});

router.get('/', function(req, res, next) {
    utils.getUser(req, res, function(req, res, user) {
    	var name = utils.validateString(false, req.query.name);
    	if (name.valid) {
    		var i = findSavings(user, name.value);
    		if (i) {
    			res.json(user.data.savings[i]);
    		} else {
    			res.status(404).json({message: "no savings entry with that name found"});
    			return false;
    		}
    	} else {
    		res.json(user.data.savings);
    	}
    });
});

router.delete('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	var params = new utils.Parameters();
    	params.entries["name"] = utils.validateString(true, req.body.name);

    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else {
    		var i = findSavings(user, params.entries["name"].value);
    		if (i) {
    			user.data.savings.splice(i, 1);
    			return true;
    		} else {
    			res.status(404).json({message: "no savings entry with that name found"});
    			return false;
    		}
    	}
    });
});

function findsavings(user, name) {
	var i = 0; 
	while (i < user.data.savings.length) {
		if (user.data.savings[i].name == name)
			return i;
	}
	return false;
}


module.exports = router;