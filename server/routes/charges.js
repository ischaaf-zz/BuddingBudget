var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

// initial entry point for all requests
router.use(function(req, res, next) {
    console.log(req.method + " /charges");
    console.log(req.body);
    next();
});

router.post('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	// name, amount, period, start, holdout, isConfirm
    	var params = new utils.Parameters();
    	params.entries["name"] = utils.validateString(true, req.body.name);
    	params.entries["amount"] = utils.validateNumber(true, req.body.amount);
    	params.entries["period"] = utils.validateString(true, req.body.period);
    	params.entries["start"] = utils.validateDate(true, req.body.start);
    	params.entries["isConfirm"] = utils.validateBool(true, req.body.isConfirm);

    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else {
    		user.data.charges.push({
    			name: params.entries["name"].value, 
    			amount: params.entries["amount"].value, 
    			period: params.entries["period"].value, 
    			start: params.entries["start"].value, 
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
    	params.entries["isConfirm"] = utils.validateBool(false, req.body.isConfirm);

    	if (!params.hasRequired()) {
            var invalid = params.getInvalid();
            res.status(422).json(invalid);
            return false;
        } else {
    		var i = findCharge(user, params.entries["name"].value);
    		if (i) {
    			if (params.entries["amount"].valid)
    				user.data.charges[i].amount = params.entries["amount"].value;
    			if (params.entries["period"].valid)
    				user.data.charges[i].period = params.entries["period"].value;
    			if (params.entries["start"].valid)
    				user.data.charges[i].start = params.entries["start"].value;
    			if (params.entries["isConfirm"].valid)
    				user.data.charges[i].isConfirm = params.entries["isConfirm"].value;
    			return true;
    		} else {
    			res.status(404).json({message: "no charge with that name found"});
    			return false;
    		}
    	}
    });
});

router.get('/', function(req, res, next) {
    utils.getUser(req, res, function(req, res, user) {
    	var name = utils.validateString(false, req.query.name);
    	if (name.valid) {
    		var i = findCharge(user, name.value);
    		if (i) {
    			res.json(user.data.charges[i]);
    		} else {
    			res.status(404).json({message: "no charge with that name found"});
    			return false;
    		}
    	} else {
    		res.json(user.data.charges);
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
    		var i = findCharge(user, params.entries["name"].value);
    		if (i) {
    			user.data.charges.splice(i, 1);
    			return true;
    		} else {
    			res.status(404).json({message: "no charge with that name found"});
    			return false;
    		}
    	}
    });
});

function findCharge(user, name) {
	for (var i in user.data.charges) {
		if (user.data.charges[i].name == name)
			return i;
	}
	return false;
}

module.exports = router;