// The general idea of this class is that it needs to populate dataManager
// with initial data upon creation from phonegap's storage, and after that
// needs to keep dataManager, phonegap's storage, and the network storage
// synchronized.

var StorageManager = function(dataManager, networkManager, readyCallback) {

	// fetch from Phonegap storage, send each data type to dataManager
	// Then call readyCallback()

	networkManager.fetchInitialData(function(data) {
		// check against phonegap storage, update phonegap
		// and dataManager if newer
	}, function() {
		// Failure callback
	});

	// can split this listener into many different pieces depending on how different their handlers are
	dataManager.registerListener(["assets", "savings", "charges", "income", "trackEntries", "options"], function(category) {
		var newData = dataManager.getData(category);
		networkManager.store(category, newData);
		// modify local storage and network storage
	});

	// THIS SHOULD GET CALLED BACK IN PHONEGAP STORAGE'S FETCH
	// CALLBACK INSTEAD ONCE THAT'S SET UP
	readyCallback();

};