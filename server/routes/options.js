var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

// initial entry point for all requests
router.use(function(req, res, next) {
    console.log(req.method + " /options");
    console.log(req.body);
    next();
});

router.put('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	var params = new utils.Parameters();
    	params.entries["isNotifyMorning"] = utils.validateBool(false, req.body.isNotifyMorning);
    	params.entries["isNotifyNight"] = utils.validateBool(false, req.body.isNotifyNight);
    	params.entries["isNotifyAssets"] = utils.validateBool(false, req.body.isNotifyAssets);
    	params.entries["notifyMorningTime"] = utils.validateNumber(false, req.body.notifyMorningTime);
    	params.entries["notifyNightTime"] = utils.validateNumber(false, req.body.notifyNightTime);
    	params.entries["notifyAssetsPeriod"] = utils.validateString(false, req.body.notifyAssetsPeriod);
        params.entries["isEnableTracking"] = utils.validateBool(false, req.body.isEnableTracking);
        params.entries["minDailyBudget"] = utils.validateNumber(false, req.body.minDailyBudget);

    	if (params.entries["isNotifyMorning"].valid) 
    		user.data.userOptions.isNotifyMorning = params.entries["isNotifyMorning"].value;
    	if (params.entries["isNotifyNight"].valid) 
    		user.data.userOptions.isNotifyNight = params.entries["isNotifyNight"].value;
    	if (params.entries["isNotifyAssets"].valid) 
    		user.data.userOptions.isNotifyAssets = params.entries["isNotifyAssets"].value;
    	if (params.entries["notifyMorningTime"].valid) 
    		user.data.userOptions.notifyMorningTime = params.entries["notifyMorningTime"].value;
    	if (params.entries["notifyNightTime"].valid) 
    		user.data.userOptions.notifyNightTime = params.entries["notifyNightTime"].value;
    	if (params.entries["notifyAssetsPeriod"].valid) 
    		user.data.userOptions.notifyAssetsPeriod = params.entries["notifyAssetsPeriod"].value;
        if (params.entries["isEnableTracking"].valid) 
            user.data.userOptions.isEnableTracking = params.entries["isEnableTracking"].value;
        if (params.entries["minDailyBudget"].valid) 
            user.data.userOptions.minDailyBudget = params.entries["minDailyBudget"].value;
    	return true;
    });
});

router.get('/', function(req, res, next) {
    utils.getUser(req, res, function(req, res, user) {
    	res.json(user.data.userOptions);
    });
});

module.exports = router;