var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel    = require('../app/models/user');
var session = require('client-sessions');
var utils = require('../utilities.js');

var onOffRegex = /(On|Off)/;

// initial entry point for all requests
router.use(function(req, res, next) {
    console.log(req.method + " /options");
    console.log(req.body);
    next();
});


router.put('/', function(req, res, next) {
    utils.modifyUser(req, res, function(req, res, user) {
    	var params = new utils.Parameters();
    	params.entries["isNotifyMorning"] = utils.validateString(false, req.body.isNotifyMorning, onOffRegex);
    	params.entries["isNotifyNight"] = utils.validateString(false, req.body.isNotifyNight, onOffRegex);
    	params.entries["isNotifyAssets"] = utils.validateString(false, req.body.isNotifyAssets, onOffRegex);
    	params.entries["notifyMorningTime"] = utils.validateDate(false, req.body.notifyMorningTime);
    	params.entries["notifyNightTime"] = utils.validateDate(false, req.body.notifyNightTime);
    	params.entries["notifyAssetsPeriod"] = utils.validateString(false, req.body.notifyAssetsPeriod);
        params.entries["isEnableTracking"] = utils.validateString(false, req.body.isEnableTracking, onOffRegex);
        params.entries["minDailyBudget"] = utils.validateNumber(false, req.body.minDailyBudget);

    	if (params.entries["isNotifyMorning"].valid) 
    		user.data.options.isNotifyMorning = params.entries["isNotifyMorning"].value;
    	if (params.entries["isNotifyNight"].valid) 
    		user.data.options.isNotifyNight = params.entries["isNotifyNight"].value;
    	if (params.entries["isNotifyAssets"].valid) 
    		user.data.options.isNotifyAssets = params.entries["isNotifyAssets"].value;
    	if (params.entries["notifyMorningTime"].valid) 
    		user.data.options.notifyMorningTime = params.entries["notifyMorningTime"].value.getTime();
    	if (params.entries["notifyNightTime"].valid) 
    		user.data.options.notifyNightTime = params.entries["notifyNightTime"].value.getTime();
    	if (params.entries["notifyAssetsPeriod"].valid) 
    		user.data.options.notifyAssetsPeriod = params.entries["notifyAssetsPeriod"].value;
        if (params.entries["isEnableTracking"].valid) 
            user.data.options.isEnableTracking = params.entries["isEnableTracking"].value;
        if (params.entries["minDailyBudget"].valid) 
            user.data.options.minDailyBudget = params.entries["minDailyBudget"].value;
    	return true;
    });
});

router.get('/', function(req, res, next) {
    utils.getUser(req, res, function(req, res, user) {
    	res.json(user.data.options);
    });
});

module.exports = router;