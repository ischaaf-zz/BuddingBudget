// This is by far the most poorly defined of the classes, because
// I'm not 100% sure how it interfaces or what it needs to do.

var NetworkManager = function() {

	var credentials = {};
	this.host = "http://ischaaf.com:8081";

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

	var lastModified;

	function login(user, pass, success) {
		console.log("loggin in");
		sendAjax("POST", {username: "ischaaf", password: "buddingbudget"}, "login", success, defaultFail);
	};

	this.fetchInitialData = function(success, failure) {
		sendAjaxLogin("GET", {}, "user?getFull=true", function(data) {
			console.log(data);
			lastModified = data.lastModified;
			console.log("updated lastModified");
			success(data);
		}, failure);
	};

	// Update assets
	this.updateAssets = function(newVal) {
		sendAjaxLogin("PUT", {assets: newVal, lastModified: lastModified}, "data", defaultSuccess, defaultFail);
	};

	this.setEndDate = function(endDate) {
		sendAjaxLogin("PUT", {endDate: endDate, lastModified: lastModified}, "data", defaultSuccess, defaultFail);
	};

	// Create and add new spending entry
	this.trackSpending = function(trackedEntry) {
		sendAjaxLogin("POST", trackedEntry, "entry", defaultSuccess, defaultFail);
	};

	// Set the specified option to a new value
	this.setOption = function(selection, value) {
		var obj = {};
		obj[selection] = value;
		sendAjaxLogin("PUT", obj, "options", defaultSuccess, defaultFail);
	};

	// Add a new entry to savings or recurring charges / income
	this.addEntry = function(category, val) {
		sendAjaxLogin("POST", val, category, defaultSuccess, defaultFail);
	};

	// Change an entry to savings or recurring charges / income
	this.changeEntry = function(category, name, newVal) {
		sendAjaxLogin("PUT", {name: name}, category, defaultSuccess, defaultFail);
	};

	// Remove an entry from savings or recurring charges / income
	this.removeEntry = function(category, name) {
		sendAjaxLogin("DELETE", {name: name}, category, defaultSuccess, defaultFail);
	};

	var loggedIn = false;

	function sendAjaxLogin(method, data, page, success, fail) {
		if (loggedIn) {
			sendAjax(method, data, page, success, fail);
		} else {
			login('ischaaf', 'buddginbudget', function(data) {
				loggedIn = true;
				sendAjax(method, data, page, success, fail);
			});
		}
	}
	var reqInProgress = false;

	function sendAjax(method, data, page, success, fail) {
		while (reqInProgress) { }
		$.ajax({
			method: method,
			url: "http://ischaaf.com:8081/" + page,
			data: data
		}).done(success).fail(fail).always(function() { reqInProgress = false; } );
	}

	function defaultFail(data) {
		console.log("ajax call failed: " + data.responseJSON.message);
	}

	function defaultSuccess(data) {
		if (data.modified) {
			lastModified = data.modified;
			console.log("updated lastModified");
		}
		console.log("ajax call succeeded");
	}

};