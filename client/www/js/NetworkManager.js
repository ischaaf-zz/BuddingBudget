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


	
	//var lastModified;

	function updateLastModified(newDate){
		if(!localStorage.getItem('lastModified')) {
  			populateStorage();
			}
		else {
		localStorage.setItem('lastModified', newDate);
		}
	}

	function populateStorage(){
		localStorage.setItem('lastModified','');
	}
	function checkLastModified(){
		if (localStorage.getItem('lastModified')== data.lastModified){
			return true;
		}
		else{
			return false;
		}
		
	}

	function createUser(user, pass, success){
		$.ajax({
    	url : "AJAX_POST_URL",
    	type: "POST",
    	data : user,
    	success: function(data, textStatus, jqXHR)
    	{
        //data - response from server
    	},
    	error: function (jqXHR, textStatus, errorThrown)
    	{
    	alert("Something went wrong");
    	}
		});

	}
	function createUser2(user, pass, success) {
		console.log("Creating user");
		enqueueSend("POST", {username: user, password: pass}, "user created", success, defaultFail);
	}


	function login(user, pass, success) {
		console.log("loggin in");
		enqueueSend("POST", {username: user, password: pass}, "login", success, defaultFail);
	}

	this.fetchInitialData = function(success, failure) {
		enqueueSend("GET", {}, "user?getFull=true", function(data) {
			console.log(data);
			//lastModified = data.lastModified;
			updateLastModified(data.lastModified);
			console.log("updated lastModified");
			success(data);
		}, failure);
	};

	// Update assets
	this.updateAssets = function(newVal) {
		enqueueSend("PUT", {assets: newVal}, "data", defaultSuccess, defaultFail);
	};

	this.setEndDate = function(endDate) {
		enqueueSend("PUT", {endDate: endDate}, "data", defaultSuccess, defaultFail);
	};

	// Create and add new spending entry
	this.trackSpending = function(trackedEntry) {
		enqueueSend("POST", trackedEntry, "entry", defaultSuccess, defaultFail);
	};

	// Set the specified option to a new value
	this.setOption = function(selection, value) {
		var obj = {};
		obj[selection] = value;
		enqueueSend("PUT", obj, "options", defaultSuccess, defaultFail);
	};

	// Add a new entry to savings or recurring charges / income
	this.addEntry = function(category, val) {
		enqueueSend("POST", val, category, defaultSuccess, defaultFail);
	};

	// Change an entry to savings or recurring charges / income
	this.changeEntry = function(category, name, newVal) {
		enqueueSend("PUT", newVal, category, defaultSuccess, defaultFail);
	};

	// Remove an entry from savings or recurring charges / income
	this.removeEntry = function(category, name) {
		enqueueSend("DELETE", {name: name}, category, defaultSuccess, defaultFail);
	};

	this.setRollover = function(rollover) {

	};

	this.setTomorrowRollover = function(tomorrowRollover) {

	};

	var loginMessage = {
		method: "POST",
		data: {username: 'ischaaf', password: 'buddingbudget'},
		page: 'login',
		success: defaultSuccess,
		fail: defaultFail
	};

	var sendQueue = [loginMessage];
	var sendInProgress = false;

	function enqueueSend(method, data, page, success, fail) {
		sendQueue.push({
			method: method, 
			data: data, 
			page: page,
			success: success,
			fail: fail
		});
		checkSend();
	}

	function checkSend() {
		if (!sendInProgress && sendQueue[0]) {
			sendInProgress = true;
			var next = sendQueue[0];
			sendQueue.splice(0, 1);
			console.log("sending request: " + next.method + " - " + next.page + " with data: " + JSON.stringify(next.data));
			sendAjax(next.method, next.data, next.page, next.success, next.fail);
		}
	}

	function sendAjax(method, data, page, success, fail) {
		if(NETWORK_ENABLED) {
			//lastModified = data.lastModified;
			updateLastModified(data.lastModified);
			$.ajax({
				method: method,
				url: "http://ischaaf.com:8081/" + page,
				data: data
			}).done(function(data) {
				console.log("SUCCESS - request: " + method + " - " + page + " with data: " + JSON.stringify(data));
				if (data.modified) {
					console.log("Updating lastModified time to: " + data.modified);
					//lastModified = data.lastModified;
					updateLastModified(data.lastModified);
				} else {
					console.log("Request returned no lastModified time");
				}
				success(data);
			}).fail(function(data) {
				console.log("FAILURE - request: " + method + " - " + page + " with data: " + JSON.stringify(data));
				fail(data);
			}).always(function() { 
				sendInProgress = false; 
				checkSend(); 
			});	
		}
	}

	function defaultFail(data) { }

	function defaultSuccess(data) { }

};
