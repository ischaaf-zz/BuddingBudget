var StorageManager = function(dataManager, readyCallback) {

	var networkManager = new NetworkManager();

	// fetch from Phonegap storage, send each data type to dataManager
	// Then call readyCallback()

	networkManager.fetchInitialData(function(data) {
		// check against phonegap storage, update if newer
		// and send to dataManager
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

}