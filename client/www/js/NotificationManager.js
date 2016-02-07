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