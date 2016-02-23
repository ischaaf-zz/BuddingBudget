// Handles actually deducting / adding money from / to assets
// based upon the recurring charges and recurring income.

// saveAssets adds the passed in value to the current assets
var RecurringManager = function(saveAssets, saveCharges, saveIncome) {
	
	var charges = [];

	var income = [];

	// Sets the charges array, and timeouts for
	// each charge
	this.setCharges = function(value) {
		charges = value;
		for(var i = 0; i < charges.length; i++) {
			updateCharge(charges[i]);
		}
	};

	// Sets the income array, and timeouts for
	// each income
	this.setIncome = function(value) {
		income = value;
		for(var i = 0; i < income.length; i++) {
			updateIncome(income[i]);
		}
	};

	this.newDay = function() {
		for(var i = 0; i < charges.length; i++) {
			updateCharge(charges[i]);
		}
		for(var i = 0; i < income.length; i++) {
			updateIncome(income[i]);
		}
	};

	// Updates the assets based upon the given recurring
	// charge, and the difference between its nextTime entry
	// and the current time. Sets a timer for it to be called
	// again next time.
	function updateCharge(entry) {
		var now = new Date();
		var isChanged = false;
		while(entry.nextTime < now || isToday(new Date(entry.nextTime))) {
			isChanged = true;
			saveAssets(-1 * entry.amount);
			entry.nextTime = findNextTime(entry);
		}
		if(isChanged) {
			saveCharges(charges, entry);
		}
	}

	// Updates the assets based upon the given recurring
	// revenue, and the difference between its nextTime entry
	// and the current time. Sets a timer for it to be called
	// again next time.
	function updateIncome(entry) {
		var now = new Date();
		var isChanged = false;
		while(entry.nextTime < now || isToday(new Date(entry.nextTime))) {
			isChanged = true;
			saveAssets(entry.amount);
			entry.nextTime = findNextTime(entry);
		}
		if(isChanged) {
			saveIncome(income, entry);
		}
	}

};