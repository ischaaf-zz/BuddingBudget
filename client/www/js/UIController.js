// Checks whether the data changes made by the UI View are valid,
// sends them to the storage manager if they are, calls failure if
// they aren't.

var UIController = function(getData, storageManager, registerUICallback) {

	// verify that newVal is a valid number
	// set assets if we can make the change
	// otherwise call failure with an error code
	registerUICallback("updateAssets", function(newVal, success, failure) {
		if(typeof(newVal) === 'number') {
			if(!isNaN(newVal)) {
				if(newVal >= 0) {
					storageManager.updateAssets(newVal, false, success, failure);
				} else {
					callFunc(failure, ["You cannot set negative assets"]);
				}
			} else {
				callFunc(failure, ['Cannot set assets to NaN']);
			}
		} else {
			callFunc(failure, ['Cannot set assets to ' + typeof(newVal)]);
		}
	});

	registerUICallback("trackSpending", function(trackedEntry, extraOption, success, failure) {
		// extraOption in storageManager is how we want to distribute the surplus / deficit.
		// verify that amount is a valid number
		// if fail, call failure with error message
		// if success, and not on budget, use success callback to get extraOption, then call storageManager
		//    valid extraOption values are ("rollover", "savings", "distribute") If they're on budget, call distribute
		if(trackedEntry instanceof TrackEntry) {
			if(isValidNumber(trackedEntry.amount)) {
				if(isValidNumber(trackedEntry.day)) {
					if(trackedEntry.amount >= 0) {
						storageManager.trackSpending(trackedEntry, extraOption, success, failure);
					} else {
						callFunc(failure, ["Spending cannot be negative."]);
					}
				} else {
					callFunc(failure, ['Invalid day in tracked entry']);
				}
			} else {
				callFunc(failure, ['Invalid amount in tracked entry']);
			}
		} else {
			callFunc(failure, ["trackedEntry isn't an instance of TrackEntry"]);
		}
	});

	registerUICallback("setOption", function(selection, value, success, failure) {
		// verify that selection and value are valid
		// if so, call storageManager equivalent function
		// else, call failure with error code
		storageManager.setOption(selection, value, success, failure);
	}); 

	registerUICallback("setEndDate", function(endDate, success, failure) {
		if(typeof(endDate) === 'number') {
			if(endDate >= new Date().getTime()) {
				storageManager.setEndDate(endDate, success, failure);
			} else {
				callFunc(failure, ['Given date is not in the future']);
			}
		} else {
			callFunc(failure, ['Given date is not a valid number']);
		}		
	});

	registerUICallback("addEntry", function(category, val, success, failure) {
		// verify the category and entry are valid
		// if so, call storageManager equivalent function
		// else, call failure with error code
		if(verifyCategory(category)) {
			// if(verifyType(category, val)) {
				if(val.name.includes('<')) {
					callFunc(failure, ["Invalid entry name"]);
				} else {
					storageManager.addEntry(category, val, success, failure);
				}
			// } else {
			// 	callFunc(failure, ["Value is invalid type for category " + category]);
			// }
		} else {
			callFunc(failure, ["Category is invalid: " + category]);
		}
	});

	registerUICallback("changeEntry", function(category, name, newVal, success, failure) {
		// verify the category index, oldVal, and newVal are valid
		// if so, call storageManager equivalent function
		// else, call failure with error code
		if(verifyCategory(category)) {
			// if(verifyType(category, newVal)) {
				console.log(newVal.amount);
			if(!isNaN(newVal.amount)) {
				if(newVal.amount >= 0) {
					storageManager.changeEntry(category, name, newVal, success, failure);
				} else {
					callFunc(failure, ["Cannot have negative entry"]);
				}
			} else {
				callFunc(failure, ['Cannot set entry to NaN']);
			}
			// } else {
			// 	callFunc(failure, ["Value is invalid type for category " + category]);
			// }
		} else {
			callFunc(failure, ["Category is invalid: " + category]);
		}
	});

	registerUICallback("removeEntry", function(category, name, success, failure) {
		// verify the category, index, and oldVal are valid
		// if so, call storageManager equivalent function
		// else, call failure with error code
		if(verifyCategory(category)) {
			storageManager.removeEntry(category, name, success, failure);
		} else {
			callFunc(failure, ["Category is invalid: " + category]);
		}
	});

	function verifyCategory(category) {
		return category == "savings" || category == "charges" || category == "income" || category == "users";
	}

	function verifyType(category, value) {
		if(category == "savings") {
			return value instanceof SavingsEntry;
		} else if(category == "charges") {
			return value instanceof ChargeEntry;
		} else if(category == "income") {
			return value instanceof IncomeEntry;
		} else {
			return false;
		}
	}

	function isValidNumber(val) {
		return (typeof(val) === 'number' && !isNaN(val));
	}
};