// Utility functions in the global namespace that may be useful for multiple objects

//enable debug options (reset and time travel)
var DEBUG_MODE = true;

//allow data to presist
var PERSIST_DATA = true;

var NETWORK_ENABLED = true;

var MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
var MAX_TIMEOUT = 2147483647;

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

function dateInputToDate(val) {
	var split = val.split("-").map(function(val) {
		return parseInt(val);
	});
	return new Date(split[0], split[1] - 1, split[2]);
}

function dateToDateInput(val) {
	return(val.getFullYear() + "-" + padDigits(val.getMonth() + 1, 2) + "-" + padDigits(val.getDate(), 2));
}

function dateToTimeInput(val) {
	return(padDigits(val.getHours(), 2) + ":" + padDigits(val.getMinutes(), 2));
}

function timeInputToDate(val) {
	var split = val.split(":").map(function(val) {
		return parseInt(val);
	});
	var returnDate = new Date();
	returnDate.setHours(split[0]);
	returnDate.setMinutes(split[1]);
	return returnDate;
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

// Clears all localforage data
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
	this.nextTime = findNextTime(this);
};

// Constructs a new recurring income entry
var IncomeEntry = function(name, amount, period, start, holdout, isConfirm) {
	this.name = name;
	this.amount = amount;
	this.period = period;
	this.start = start;
	this.holdout = holdout;
	this.isConfirm = isConfirm;
	this.nextTime = findNextTime(this);
};

// Constructs a new daily tracking entry
var TrackEntry = function(amount, budget, day) {
	this.amount = amount;
	this.budget = budget;
	this.day = day;
};

var Options = function(isNotifyMorning, isNotifyNight, isNotifyAssets, isEnableTracking, notifyMorningTime, notifyNightTime, notifyAssetsPeriod, minDailyBudget) {
	this.isNotifyMorning = isNotifyMorning;
	this.isNotifyNight = isNotifyNight;
	this.isNotifyAssets = isNotifyAssets;
	this.isEnableTracking = isEnableTracking;
	this.notifyMorningTime = notifyMorningTime;
	this.notifyNightTime = notifyNightTime;
	this.notifyAssetsPeriod = notifyAssetsPeriod;
	this.minDailyBudget = minDailyBudget;
};

function findNextTime(entry, startTime) {
	var period = entry.period;
	var start = entry.start;
	var lastTime;
	var diff;
	if(typeof startTime === "undefined") {
		if(entry.nextTime) {
			lastTime = new Date(entry.nextTime);
		} else {
			lastTime = new Date();
			lastTime.setDate(lastTime.getDate() - 1);
		}
	} else {
		lastTime = startTime;
	}
	var nextTime = new Date(lastTime);
	if(period == "monthly") {
		start = (new Date(start)).getDate();
		nextTime.setDate(start);
		if(nextTime < lastTime || isSameDay(nextTime, lastTime)) {
			nextTime.setMonth(nextTime.getMonth() + 1);
		}
	} else if(period == "weekly") {
		start = (new Date(start)).getDay();
		diff = start - nextTime.getDay();
		nextTime.setDate(nextTime.getDate() + diff);
		if(nextTime < lastTime || isSameDay(nextTime, lastTime)) {
			nextTime.setDate(nextTime.getDate() + 7);
		}
	}
	// else if(period == "biweekly") {
	// 	diff = (trimToDay(nextTime.getTime()) - trimToDay(start)) / MILLISECONDS_PER_DAY;
	// 	var offset = diff % 14;
	// 	nextTime.setDate(nextTime.getDate() + 14 - offset);
	// } else if(period == "twiceMonthly") {
	// 	console.log("twicemonthly ont supported yet");
	// }
	return nextTime.getTime();
}

function trimToDay(dateLong) {
	return dateLong - (dateLong % MILLISECONDS_PER_DAY);
}

function getTimeDate(hours, minutes, seconds) {
	var date = new Date();
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(seconds);
	return date;
}

// ---------------------------------------------------------------------------------
