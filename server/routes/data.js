var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

// initial entry point for all requests
router.use(function(req, res, next) {
    console.log(req.method + " /data");
    console.log(req.body);
    next();
});

router.put('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	var params = new utils.Parameters();
    	params.entries["assets"]  = utils.validateNumber(false, req.body.assets, true);
    	params.entries["endDate"] = utils.validateDate(false, req.body.endDate, true);
        params.entries["rollover"]  = utils.validateNumber(false, req.body.rollover, true);
        params.entries["tomorrowRollover"]  = utils.validateNumber(false, req.body.tomorrowRollover, true);

    	if (params.entries["assets"].valid)
    		user.data.assets = params.entries["assets"].value;
        else if (params.entries["assets"].message != "Parameter was not defined") {
            res.status(422).json({message: "the given assets value could not be parsed"});
            return false;
        }
    	if (params.entries["endDate"].valid)
    		user.data.endDate = params.entries["endDate"].value;
        else if (params.entries["endDate"].message != "Parameter was not defined") {
            res.status(422).json({message: "the given endDate value could not be parsed"});
            return false;
        }
        if (params.entries["rollover"].valid)
            user.data.rollover = params.entries["rollover"].value;
        else if (params.entries["rollover"].message != "Parameter was not defined") {
            res.status(422).json({message: "the given rollover value could not be parsed"});
            return false;
        }
        if (params.entries["tomorrowRollover"].valid)
            user.data.tomorrowRollover = params.entries["tomorrowRollover"].value;
        else if (params.entries["tomorrowRollover"].message != "Parameter was not defined") {
            res.status(422).json({message: "the given tomorrowRollover value could not be parsed"});
            return false;
        }
    	return true;
    });
});

router.get('/', function(req, res, next) {
    utils.getUser(req, res, function(req, res, user) {
    	res.json(user.data);
    });
});

module.exports = router;