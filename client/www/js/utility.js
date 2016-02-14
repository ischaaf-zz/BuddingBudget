// Utility functions in the global namespace that may be useful for multiple objects

// Checks if two date objects represent the same day
// Assumes the user's current time zone applies for both dates.
function isSameDay(date1, date2) {
	return date1.toDateString() === date2.toDateString();
}

// Checks if the date object represents today's date in the
// user's current time zone.
function isToday(date) {
	return isSameDay(date, new Date());
}

// Checks if the passed in function exists, and calls it with
// the passed in arguments if it does. Lets us check and call
// functions in a single line without freaking out the linter.
function callFunc(func, args) {
	if(typeof(func) === 'function') {
		func.apply(window, args);
	}
}

// Makes a deep copy of the passed in data
function deepCopy(newData) {
	if(newData === undefined) {
		return undefined;
	}
	return JSON.parse(JSON.stringify(newData));
}

function indexOfData(arr, key, value) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i][key] === value) {
			return i;
		}
	}
	return -1;
}

// Clears all localStorage data
function clearStorage() {
	localforage.clear();
}

// Constructors for data entries ---------------------------------------------------

// Constructs a new savings entry
var SavingsEntry = function(name, amount, isDefault) {
	this.name = name;
	this.amount = amount;
	this.isDefault = isDefault;
};

// Constructs a new recurring charge entry
var ChargeEntry = function(name, amount, period, start, isConfirm) {
	this.name = name;
	this.amount = amount;
	this.period = period;
	this.start = start;
	this.isConfirm = isConfirm;
};

// Constructs a new recurring income entry
var IncomeEntry = function(name, amount, period, start, holdout, isConfirm) {
	this.name = name;
	this.amount = amount;
	this.period = period;
	this.start = start;
	this.holdout = holdout;
	this.isConfirm = isConfirm;
};

// Constructs a new daily tracking entry
var TrackEntry = function(amount, budget, day) {
	this.amount = amount;
	this.budget = budget;
	this.day = day;
};

// ---------------------------------------------------------------------------------