var SavingsEntry = function(name, amount, isDefault) {
	this.name = name;
	this.amount = amount;
	this.isDefault = isDefault;
};

var ChargeEntry = function(name, amount, period, start, isConfirm) {
	this.name = name;
	this.amount = amount;
	this.period = period;
	this.start = start;
	this.isConfirm = isConfirm;
};

var IncomeEntry = function(name, amount, period, start, portionSaved, isConfirm) {
	this.name = name;
	this.amount = amount;
	this.period = period;
	this.start = start;
	this.portionSaved = portionSaved;
	this.isConfirm = isConfirm;
};