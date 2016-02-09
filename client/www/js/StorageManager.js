// The general idea of this class is that it needs to populate dataManager
// with initial data upon creation from phonegap's storage, and after that
// needs to keep dataManager, phonegap's storage, and the network storage
// synchronized.

var StorageManager = function(dataManager, networkManager, readyCallback) {

	// Update assets
	this.updateAssets = function(newVal) {
		// update network and local storage
		dataManager.setData('assets', newVal);
	};

	// Create and add new spending entry
	this.trackSpending = function(amount) {

	};

	// Set the specified option to a new value
	this.setOption = function(selection, value) {

	};

	// Add a new entry to savings or recurring charges / income
	this.addEntry = function(category, val) {

	};

	// Change an entry to savings or recurring charges / income
	this.changeEntry = function(category, oldVal, newVal) {

	};

	// Remove an entry from savings or recurring charges / income
	this.removeEntry = function(category, oldVal) {

	};

	// fetch from Phonegap storage, send each data type to dataManager
	// Then call readyCallback()

	networkManager.fetchInitialData(function(data) {
		// check against phonegap storage, update phonegap
		// if newer, and dataManager from that.
	}, function() {
		// Failure callback
	});

	// THIS SHOULD GET CALLED BACK IN PHONEGAP STORAGE'S FETCH
	// CALLBACK INSTEAD ONCE THAT'S SET UP
	readyCallback();

};