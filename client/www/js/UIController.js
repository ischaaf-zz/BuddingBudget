var UIController = function(dataManager, registerUICallback) {
	
	registerUICallback("sendNewData", function(category, newData, success, failure) {
		// get data from dataManager, verify newData can be inserted,
		// insert it, call success / failure function

		// This should probably call separate function handlers depending
		// upon the category.
	});

	registerUICallback("changeData", function(category, id, newData, success, failure) {
		// get data from dataManager, verify id can be changed,
		// insert it, call success / failure function
		var currentData = dataManager.getData(category);

		// This should probably call separate function handlers depending
		// upon the category. For now, it's really only set up to handle
		// assets.

		if(currentData === undefined) {
			callFunc(failure, ['Invalid data category: ' + category]);
		} else if(typeof(newData) !== typeof(currentData)){
			callFunc(failure, ['Invalid data type for category ' + category + ': ' + typeof(newData)]);
		} else if(typeof(newData) === 'number' && isNaN(newData)) {
			callFunc(failure, ['NaN is an invalid number']);
		} else {
			dataManager.setData(category, newData);
			callFunc(success);
		}

	});

	registerUICallback("removeData", function(category, id, success, failure) {
		// get data from dataManager, verify id can be removed,
		// insert it, call success / failure function

		// This should probably call separate function handlers depending
		// upon the category.
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