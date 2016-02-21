// Handles creating and destroying notifications based upon how
// the data changes. Acts as an intermediary between the application
// and the somewhat difficult to understand LocalNotification api.
var NotificationManager = function(getData, setDataListener) {
	
	setDataListener(["ready", "budget", "options"], function(type) {
		// get options and budget, destroy and remake notifications
		cordova.plugins.notification.local.clearAll(function() {
			var options = getData('options');
			var budget = getData('budget');
			// set morning at time if isNotifyMorning
			// set night at time if isNotifyNight
			// set assets at time and date if isNotifyAssets
		});
	});

};