var UIController = function(dataManager, registerUICallback) {

	// verify that newVal is a valid number
	// set assets and call success if we can make the change
	// otherwise call failure with an error code
	registerUICallback("updateAssets", function(newVal, success, failure) {
		if(typeof(newVal) === 'number') {
			if(!isNaN(newVal)) {
				dataManager.setData('assets', newVal);
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


	// For these three "(val instanceof(SavingsEntry))" might be useful to determine
	// if it's a valid insertion. Or that might be overkill, I'm not sure. 

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

	// Helper function. Lets us call optional success and
	// failure functions without explicitly checking that they
	// exist every time.
	function callFunc(func, args) {
		if(typeof(func) === 'function') {
			func.apply(window, args);
		}
	}

};