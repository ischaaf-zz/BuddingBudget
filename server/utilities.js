var mongoose = require('mongoose');

function existsAndMatches(value, regex) {
	if (!value) {
		return false;
	}
	return regex.test(value);
}

function existsAndNumber(value) {
	return !isNaN(value);
}

function validateUsername(username) {
	return username && 
		typeof(username) == 'string' && 
		/^[a-zA-Z0-9]{1,20}$/.test(username);
}

function validatePassword(password) {
	return password && 
		typeof(password) == 'string' && 
		/^[a-zA-Z0-9]{1,20}$/.test(password);	
}

function validateName(name) {
	return name && 
		typeof(name) == 'string' && 
		/^[a-zA-Z0-9 ]{1,20}$/.test(name);
}

function validateNumber(number) {
	return number && !isNaN(number);
}

function validateString(string) {
	return string && typeof(string) == 'string';
}

function validateDate(date) {
	if (typeof date != 'Date')
		date = new Date(date);

	return date && date.toString() != 'Invalid Date';
}

function modifyUser(req, res, useranme, whatToDo) {
	mongoose.findOne({'username': username}, function(err, user) {
		if (!user) {
			res.status(404);
			res.json({message: "user not found"});
		} else {
			whatToDo(req, res, user);
		}
	});
}

module.exports = {
	username: validateUsername,
	password: validatePassword,
	name: validateName,
	number: validateNumber,
	string: validateString,
	date: validateDate
};