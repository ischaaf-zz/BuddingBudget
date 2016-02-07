// The general idea of this class is that it needs to populate dataManager
// with initial data upon creation from phonegap's storage, and after that
// needs to keep dataManager, phonegap's storage, and the network storage
// synchronized.

var StorageManager = function(dataManager, readyCallback) {

	var networkManager = new NetworkManager();

	// fetch from Phonegap storage, send each data type to dataManager
	// Then call readyCallback()

	networkManager.fetchInitialData(function(data) {
		// check against phonegap storage, update phonegap
		// and dataManager if newer
	}, function() {
		// Failure callback
	});

	dataManager.registerListener(["assets", "savings", "charges", "income", "trackEntries", "options"], function(type) {
		var newData = dataManager.getData(type);
		networkManager.store(type, newData);
		// modify local storage and network storage
	});

	// THIS SHOULD GET CALLED BACK IN PHONEGAP STORAGE'S FETCH
	// CALLBACK INSTEAD ONCE THAT'S SET UP
	readyCallback();

};