// This is by far the most poorly defined of the classes, because
// I'm not 100% sure how it interfaces or what it needs to do.

var NetworkManager = function() {

	var credentials = {};

	// possible callbacks:
	// loginFailure, loggedIn, networkError, dataConflict, etc

	// This is just how I think you could potentially inform
	// the rest of the app of what's going on with asynchronous
	// network goings-ons. If you guys can think of a better way
	// to do this, feel free to replace anything and everything
	// you want.
	var callbacks = {};

	this.registerListener = function(event, callback) {
		callbacks[event] = callbacks[event] || [];
		callbacks[event].push(callback);
	};

	function notifyListeners(event, args) {
		var callbackArr = callbacks[event] || [];
		for(var i = 0; i < callbackArr.length; i++) {
			callbackArr[i].apply(window, args);
		}
	}

	this.login = function(user, pass) {

	};

	this.fetchInitialData = function(success, failure) {
		success({});
	};

	// Update assets
	this.updateAssets = function(newVal) {
		
	};

	this.setEndDate = function(endDate) {

	};

	// Create and add new spending entry
	this.trackSpending = function(trackedEntry) {
		
	};

	// Set the specified option to a new value
	this.setOption = function(selection, value) {
		
	};

	// Add a new entry to savings or recurring charges / income
	this.addEntry = function(category, val) {
		
	};

	// Change an entry to savings or recurring charges / income
	this.changeEntry = function(category, name, newVal) {
		
	};

	// Remove an entry from savings or recurring charges / income
	this.removeEntry = function(category, name) {
		
	};

};