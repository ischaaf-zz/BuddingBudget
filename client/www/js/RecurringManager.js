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
		charges = deepCopy(value);
		for(var i = 0; i < charges; i++) {
			updateCharge(charges[i], i);
		}
	};

	// Sets the income array, and timeouts for
	// each income
	this.setIncome = function(value) {
		clearTimeouts(incomeTimeouts);
		income = deepCopy(value);
		for(var i = 0; i < charges; i++) {
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
	function updateCharge(entry, index) {
		var nextTime = entry.nextTime;
		var now = new Date();
		while(nextTime < now || isToday(nextTime)) {
			saveAssets(-1 * entry.amount);
			entry.nextTime = findNextTime(entry);
		}
		saveCharges(charges);
		chargeTimeouts[i] = setTimeout(function() {
			updateCharge(entry, index);
		}, entry.nextTime - now);
	}

	// Updates the assets based upon the given recurring
	// revenue, and the difference between its nextTime entry
	// and the current time. Sets a timer for it to be called
	// again next time.
	function updateIncome(entry, index) {
		var nextTime = entry.nextTime;
		var now = new Date();
		while(nextTime < now || isToday(nextTime)) {
			saveAssets(entry.amount);
			entry.nextTime = findNextTime(entry);
		}
		saveIncome(income);
		incomeTimeouts[i] = setTimeout(function() {
			updateIncome(entry, index);
		}, entry.nextTime - now);
	}
	
	// document.addEventListener('resume', function () {
 //        // kill and remake all timeouts
 //        // if remaking one in the past, fire its event,
 //        // and make it at the next time interval.
 //    }, false);

	// THIS CLASS NEEDS TO DETERMINE IF WE ARE AT OR PAST
	// ANY OF THE nextTime VALUES IN A CHARGE OR INCOME
	// AND CHANGE ASSETS / THE nextTime VALUE ACCORDINGLY.
	// SHOULD ALSO MANAGE SETTING NOTIFICATIONS FOR CONFIRMING
	// THE CHARGE.


	// SET TIMEOUT FOR EACH, BIND PHONEGAP RESUME TO KILL ALL
	// TIMEOUTS AND RECREATE THEM

	// WHILE SETTING TIMEOUT, IF WOULD SET IN PAST, FIRE FUNCTION
	// REPEAT IF STILL IN PAST / SET TIMEOUT IF NOT

	// while nextTime < today || isToday(nextTime)
	// fire timeout function immediately
	// ONCE OUT, SET TIMEOUT AS NORMAL

	// timeout is set to update assets and charges / income
	// PLUS MAYBE USE NOTIFICATIONS FOR CONFIRM?
	// then to set nextTime using findNextTime
	// and to set the next timeout

};