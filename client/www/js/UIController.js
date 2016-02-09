// Checks whether the data changes made by the UI View are valid,
// sends them to the storage manager if they are, calls failure if
// they aren't.

var UIController = function(getData, storageManager, registerUICallback) {

	// verify that newVal is a valid number
	// set assets and call success if we can make the change
	// otherwise call failure with an error code
	registerUICallback("updateAssets", function(newVal, success, failure) {
		if(typeof(newVal) === 'number') {
			if(!isNaN(newVal)) {
				storageManager.updateAssets(newVal);
				callFunc(success);
			} else {
				callFunc(failure, ['Cannot set assets to NaN']);
			}
		} else {
			callFunc(failure, ['Cannot set assets to ' + typeof(newVal)]);
		}
	});

	registerUICallback("trackSpending", function(amount, success, failure) {
		// verify that amount is a valid number
		// make sure the new budget isn't below zero
		// if fail, call failure with error message
		// if success, call success with callbacks for possible user
		//    options (rollover, savings, distribute)
	});

	registerUICallback("setOption", function(selection, value, success, failure) {
		// verify that selection and value are valid
		// if so, get, update, and set options for dataManager - call success
		// else, call failure with error code
	}); 

	registerUICallback("addEntry", function(category, val, success, failure) {
		// verify the category and entry are valid
		// if so, update data and insert into dataManager, call success
		// else, call failure with error code
	});

	registerUICallback("changeEntry", function(category, oldVal, newVal, success, failure) {
		// verify the category and entry are valid
		// if so, update data and insert into dataManager, call success
		// else, call failure with error code
	});

	registerUICallback("removeEntry", function(category, oldVal, success, failure) {
		// verify the category and entry are valid
		// if so, update data and insert into dataManager, call success
		// else, call failure with error code
	});

};