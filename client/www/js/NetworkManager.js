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

	this.registerCallback = function(event, callback) {
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
		return {};
	};

	this.store = function(type, newData) {

	};

};