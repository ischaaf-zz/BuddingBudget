// Utility functions in the global namespace that may be useful for multiple objects

var PERSIST_DATA = true;


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

function isTodayOrLater(date) {
	var today = new Date();
	return isSameDay(date, today) || (date > today);
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

// Clears all localforage data
function clearStorage() {
	localforage.clear();
}

function setTempData() {
	var savingsArray = [];
	savingsArray.push(new SavingsEntry("test1", 20, true));
	savingsArray.push(new SavingsEntry("test2", 100, false));

	var chargesArray = [];
	chargesArray.push(new ChargeEntry("test1", 20, "monthly", 1, false));
	chargesArray.push(new ChargeEntry("test2", 40, "weekly", 6, true));

	var incomeArray = [];
	incomeArray.push(new IncomeEntry("test1", 20, "weekly", 4, 5, true));
	incomeArray.push(new IncomeEntry("test2", 40, "monthly", 1, 0, false));

	dataManager.setData('assets', 33);
	dataManager.setData('endDate', new Date());
	dataManager.setData('savings', savingsArray);
	dataManager.setData('charges', chargesArray);
	dataManager.setData('income', incomeArray);
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
	this.nextTime = findNextTime(period, start);
};

// Constructs a new recurring income entry
var IncomeEntry = function(name, amount, period, start, holdout, isConfirm) {
	this.name = name;
	this.amount = amount;
	this.period = period;
	this.start = start;
	this.holdout = holdout;
	this.isConfirm = isConfirm;
	this.nextTime = findNextTime(period, start);
};

// Constructs a new daily tracking entry
var TrackEntry = function(amount, budget, day) {
	this.amount = amount;
	this.budget = budget;
	this.day = day;
};

function findNextTime(period, start) {
	var today = new Date();
	var nextTime = new Date();
	if(period == "monthly") {
		nextTime.setDate(start);
		if(nextTime < today) {
			nextTime.setMonth(nextTime.getMonth() + 1);
		}
	} else if(period == "weekly") {
		var diff = start - nextTime.getDay();
		nextTime.setDate(nextTime.getDate() + diff);
		if(nextTime < today) {
			nextTime.setDate(nextTime.getDate() + 7);
		}
	} else if(period == "biweekly") {

	} else if(period == "twiceMonthly") {

	}
}

// ---------------------------------------------------------------------------------