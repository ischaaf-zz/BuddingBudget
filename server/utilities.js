var UserModel = require('./app/models/user');
var session   = require('client-sessions');

function validateString(required, value, regex) {
	var result = new ValidationResult(required, value, true, "", value);
	if (!value) {
		result.valid = false;
		result.message = "Parameter was not defined";
	} else if (regex && !regex.test(value)) {
		result.valid = false;
		result.message = "Parameter failed to pass regex test";
	}
	return result;
}

function validateNumber(required, value, min, max) {
	var result = new ValidationResult(required, undefined, true, "", value);
	if (value == undefined) {
		result.valid = false;
		result.message = "Parameter was not defined";
	} else if (isNaN(value)) {
		result.valid = false;
		result.message = "Parameter was not a number";
	} else if (min && value < min) {
		result.valid = false;
		result.message = "Parameter must be greater than " + min;
	} else if (max && value < max) {
		result.valid = false;
		result.message = "Parameter must be less than " + max;
	} else {
		result.value = parseFloat(value);
	}
	return result;
}

function validateDate(required, value, stripTime) {
	var result = new ValidationResult(required, undefined, true, "", value);
	var log = "Parsing date '" + value + "' (" + typeof(value) + ") - ";
	if (!value) {
		result.valid = false;
		result.message = "Parameter was not defined";
	} else if (typeof(value) != "Date") {
		if (isNaN(value)) {
			log += "converting from string - ";
			value = new Date(Date.parse(value));
		} else {
			log += "parsing from number - ";
			value = new Date(parseInt(value));
		}
		if (stripTime) {
			log += "removing time - ";
			value.setHours(0, 0, 0, 0);
		}
		result.value = value;
		if (isNaN(value.getTime())) {
			result.valid = false;
			result.message = "Parameter was not a valid date";
			log += "failed to create valid date";
		} else {
			log += "succcessfully created valid date";
		}
	} else {
		log += "value is already a date";
	}
	console.log(log);
	return result;
}

function validateBool(required, value) {
	var result = new ValidationResult(required, undefined, true, "", value);
	if (value == undefined) {
		result.valid = false;
		result.message = "Parameter was not defined";
	} else if (value.toString().toLowerCase() == 'true' || value.toString().toLowerCase() == 'on') {
		result.value = true;
	} else if (value.toString().toLowerCase() == 'false' || value.toString().toLowerCase() == 'off') {
		result.value = false;
	} else {
		result.valid = false;
		result.message = "Parameter was not a valid boolean";
	}
	return result;
}

function modifyUser(req, res, whatToDo) {
	if (!req.session.user) {
		res.status(401);
		res.json({message: "not logged in"});
	} else {
		UserModel.findOne({'username': req.session.user}, function(err, user) {
			if (err) {
				res.status(500);
				res.send(err);
			} else if (!user) {
				res.status(404);
				res.json({message: "user not found"});
			} else {
				var lastModified = validateDate(true, req.body.lastModified);
				if (!lastModified.valid || lastModified.value.getTime() != user.lastModified.getTime()) {
					res.status(409).json({message: "you do not have the most recent update for this user"});
				} else {
					var success = whatToDo(req, res, user);
					if (success) {
						var date = Date.now();
						user.lastModified = date;
						user.save(function(err) {
							if (err) {
								res.send(err);
							} else {
								res.json({message: "Success", modified: date});
							}
						});
					}
				}
			}
		});
	}
}

function getUser(req, res, whatToDo) {
	if (!req.session.user) {
		res.status(401);
		res.json({message: "not logged in"});
	} else {
		UserModel.findOne({'username': req.session.user}, function(err, user) {
			if (err) {
				res.status(500);
				res.send(err);
			} else if (!user) {
				res.status(404);
				res.json({message: "user not found"});
			} else {
				whatToDo(req, res, user);
			}
		});
	}	
}

function Parameters() {
	this.entries = {};
	this.hasRequired = function() {
		for (var name in this.entries) {
			if (!this.entries.hasOwnProperty(name))
				continue;
			var result = this.entries[name];
			if (result.required && !result.valid) {
				return false;
			}
		}
		return true;
	};
	this.getInvalid = function() {
		var res = {};
		for (var name in this.entries) {
			if (!this.entries.hasOwnProperty(name))
				continue;
			var result = this.entries[name];
			if (!result.valid) {
				res[name] = result;
			}
		}
		return res;
	};
}

function ValidationResult(required, value, valid, message, original) {
	this.required = required;
	this.value = value;
	this.valid = valid;
	this.message = message;
	this.original = original;
}

module.exports = {
	validateString: validateString,
	validateNumber: validateNumber,
	validateDate: validateDate,
	validateBool: validateBool,
	modifyUser: modifyUser,
	getUser: getUser,
	Parameters: Parameters
};