// Handles actually deducting / adding money from / to assets
// based upon the recurring charges and recurring income.

// saveAssets adds the passed in value to the current assets
var RecurringManager = function(saveAssets, saveCharges, saveIncome) {
	
	var charges = [];
	var chargeTimeouts = [];

	var income = [];
	var incomeTimeouts = [];

	// Sets the charges array, and timeouts for
	// each charge
	this.setCharges = function(value) {
		clearTimeouts(chargeTimeouts);
		charges = value;
		for(var i = 0; i < charges.length; i++) {
			updateCharge(charges[i], i);
		}
	};

	// Sets the income array, and timeouts for
	// each income
	this.setIncome = function(value) {
		clearTimeouts(incomeTimeouts);
		income = value;
		for(var i = 0; i < income.length; i++) {
			updateIncome(income[i], i);
		}
	};

	// Clears all timeouts in an array.
	function clearTimeouts(arr) {
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] !== undefined) {
				clearTimeout(arr[i]);
				arr[i] = undefined;
			}
		}
		arr.length = 0;
	}

	// Updates the assets based upon the given recurring
	// charge, and the difference between its nextTime entry
	// and the current time. Sets a timer for it to be called
	// again next time.
	function updateCharge(entry, index, remainingTime) {
		var nextCallTime = remainingTime;
		if(!remainingTime) {
			var now = new Date();
			while(entry.nextTime < now || isToday(new Date(entry.nextTime))) {
				saveAssets(-1 * entry.amount);
				entry.nextTime = findNextTime(entry);
			}
			saveCharges(charges, entry);
			var beginningNextDay = entry.nextTime - (entry.nextTime % MILLISECONDS_PER_DAY);
			nextCallTime = beginningNextDay + 60000 - now.getTime();
		}
		remainingTime = Math.max(nextCallTime - MAX_TIMEOUT, 0);
		chargeTimeouts[index] = setTimeout(function() {
			updateCharge(entry, index, remainingTime);
		}, Math.min(nextCallTime, MAX_TIMEOUT));
	}

	// Updates the assets based upon the given recurring
	// revenue, and the difference between its nextTime entry
	// and the current time. Sets a timer for it to be called
	// again next time.
	function updateIncome(entry, index) {
		var now = new Date();
		while(entry.nextTime < now || isToday(new Date(entry.nextTime))) {
			saveAssets(entry.amount);
			entry.nextTime = findNextTime(entry);
		}
		saveIncome(income, entry);
		var beginningNextDay = entry.nextTime - (entry.nextTime % MILLISECONDS_PER_DAY);
		incomeTimeouts[index] = setTimeout(function() {
			updateIncome(entry, index);
		}, beginningNextDay + 60000 - now.getTime());
	}

};