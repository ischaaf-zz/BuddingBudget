var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

// initial entry point for all requests
router.use(function(req, res, next) {
    console.log(req.method + " /income");
    console.log(req.body);
    next();
});

router.post('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	// name, amount, period, start, holdout, isConfirm
        var params = new utils.Parameters();
    	params.entries["name"]      = utils.validateString(true, req.body.name);
    	params.entries["amount"]    = utils.validateNumber(true, req.body.amount);
    	params.entries["period"]    = utils.validateString(true, req.body.period);
    	params.entries["start"]     = utils.validateDate(true, req.body.start);
    	params.entries["holdout"]   = utils.validateNumber(true, req.body.holdout);
    	params.entries["isConfirm"] = utils.validateBool(true, req.body.isConfirm);

    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else {
            if (findIncome(user, params.entries["name"].value)) {
                res.status(403).json({message: "Name already taken"});
            }
    		user.data.income.push({
    			name: params.entries["name"].value, 
    			amount: params.entries["amount"].value, 
    			period: params.entries["period"].value, 
    			start: params.entries["start"].value, 
    			holdout: params.entries["holdout"].value, 
    			isConfirm: params.entries["isConfirm"].value
    		});
    		return true;
    	}
    });
});

router.put('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
        var params = new utils.Parameters();
    	params.entries["name"] = utils.validateString(true, req.body.name);
    	params.entries["amount"] = utils.validateNumber(false, req.body.amount);
    	params.entries["period"] = utils.validateString(false, req.body.period);
    	params.entries["start"] = utils.validateDate(false, req.body.start);
    	params.entries["holdout"] = utils.validateNumber(false, req.body.holdout);
    	params.entries["isConfirm"] = utils.validateBool(false, req.body.isConfirm);

    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else {
    		var i = findIncome(user, params.entries["name"].value);
    		if (i) {
    			if (params.entries["amount"].valid)
    				user.data.income[i].amount = params.entries["amount"].value;
    			if (params.entries["period"].valid)
    				user.data.income[i].period = params.entries["period"].value;
    			if (params.entries["start"].valid)
    				user.data.income[i].start = params.entries["start"].value;
    			if (params.entries["holdout"].valid)
    				user.data.income[i].holdout = params.entries["holdout"].value;
    			if (params.entries["isConfirm"].valid)
    				user.data.income[i].isConfirm = params.entries["isConfirm"].value;
    			return true;
    		} else {
    			res.status(404).json({message: "no income with that name found"});
    			return false;
    		}
    	}
    });
});

router.get('/', function(req, res, next) {
    utils.getUser(req, res, function(req, res, user) {
    	var name = utils.validateString(false, req.query.name);
    	if (name.valid) {
    		var i = findIncome(user, name.value);
    		if (i) {
    			res.json(user.data.income[i]);
    		} else {
    			res.status(404).json({message: "no income with that name found"});
    			return false;
    		}
    	} else {
    		res.json(user.data.income);
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
    		var i = findIncome(user, params.entries["name"].value);
    		if (i) {
    			user.data.income.splice(i, 1);
    			return true;
    		} else {
    			res.status(404).json({message: "no income with that name found"});
    			return false;
    		}
    	}
    });
});

function findIncome(user, name) {
	for (i in user.data.income) {
		if (user.data.income[i].name == name)
			return i;
	}
	return false;
}


module.exports = router;