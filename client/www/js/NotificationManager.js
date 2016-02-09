// Handles creating and destroying notifications based upon how
// the data changes. Acts as an intermediary between the application
// and the somewhat difficult to understand LocalNotification api.
var NotificationManager = function(getData, setDataListener) {
	
	setDataListener(["budget", "options"], function(type) {
		// get options and budget, destroy and remake notifications
		console.log("TYPE: " + type);
	});	

	setDataListener("ready", function() {
		// set initial notifications
		console.log("READY");
	});

};