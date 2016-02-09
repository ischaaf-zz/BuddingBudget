// Utility functions in the global namespace that may be useful for multiple objects

function isSameDay(date1, date2) {
	return date1.toDateString() === date2.toDateString();
}

function isToday(date) {
	return isSameDay(date, new Date());
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
var IncomeEntry = function(name, amount, period, start, portionSaved, isConfirm) {
	this.name = name;
	this.amount = amount;
	this.period = period;
	this.start = start;
	this.portionSaved = portionSaved;
	this.isConfirm = isConfirm;
};

// Constructs a new daily tracking entry
var TrackEntry = function(amount, budget, day) {
	this.amount = amount;
	this.budget = budget;
	this.day = day;
};

// ---------------------------------------------------------------------------------