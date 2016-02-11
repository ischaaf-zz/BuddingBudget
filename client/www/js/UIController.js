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
				storageManager.updateAssets(newVal, success, failure);
			} else {
				callFunc(failure, ['Cannot set assets to NaN']);
			}
		} else {
			callFunc(failure, ['Cannot set assets to ' + typeof(newVal)]);
		}
	});

	// WHEN IT SAYS TO CHECK IF SOMETHING IS VALID, YOU DON'T NEED TO CHECK THAT
	// IT EXISTS IN DATAMANAGER OR ANYTHING LIKE THAT, STORAGEMANAGER DOES THAT.
	// YOU JUST NEED TO SANITY CHECK THAT IT'S THE CORRECT TYPE AND THINGS LIKE
	// THAT.

	registerUICallback("trackSpending", function(trackedEntry, success, failure) {
		// extraOption in storageManager is how we want to distribute the surplus / deficit.
		// verify that amount is a valid number
		// if fail, call failure with error message
		// if success, and not on budget, use success callback to get extraOption, then call storageManager
		//    valid extraOption values are ("rollover", "savings", "distribute") If they're on budget, call distribute
	});

	registerUICallback("setOption", function(selection, value, success, failure) {
		// verify that selection and value are valid
		// if so, call storageManager equivalent function
		// else, call failure with error code
	}); 

	registerUICallback("addEntry", function(category, val, success, failure) {
		// verify the category and entry are valid
		// if so, call storageManager equivalent function
		// else, call failure with error code
	});

	registerUICallback("changeEntry", function(category, index, oldVal, newVal, success, failure) {
		// verify the category index, oldVal, and newVal are valid
		// if so, call storageManager equivalent function
		// else, call failure with error code
	});

	registerUICallback("removeEntry", function(category, index, oldVal, success, failure) {
		// verify the category, index, and oldVal are valid
		// if so, call storageManager equivalent function
		// else, call failure with error code
	});

};