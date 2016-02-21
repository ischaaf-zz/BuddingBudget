// Handles creating and destroying notifications based upon how
// the data changes. Acts as an intermediary between the application
// and the somewhat difficult to understand LocalNotification api.
var NotificationManager = function(getData, setDataListener) {
	
	setDataListener(["ready", "budget", "options"], function(type) {
		// get options and budget, destroy and remake notifications
		cordova.plugins.notification.local.clearAll(function() {
			var options = getData('options');
			var budget = getData('budget');
			var time;

			// set morning at time if isNotifyMorning
			if(options.isNotifyMorning) {
				time = new Date();
				time.setDate(time.getDate() + 1);
				time = copyTimeOfDay(time, new Date(options.notifyMorningTime));
				setNotification("Your budget is $" + budget, time);
			}

			// set night at time if isNotifyNight
			if(options.isNotifyNight) {
				time = new Date();
				time = copyTimeOfDay(time, new Date(options.notifyNightTime));
				setNotification("Tap here to track your spending", time);
			}

			// set assets at time and date if isNotifyAssets
			if(options.isNotifyAssets) {
				time = new Date();
				time.setDate(1);
				if(time < (new Date())) {
					time.setMonth(time.getMonth() + 1);
				}
				time.setHour(9);
				time.setMinutes(0);
				setNotification("Remember to check your assets!", time);
			}

		});
	});

	function copyTimeOfDay(destDate, sourceDate) {
		destDate.setHour(sourceDate.getHour());
		destDate.setMinutes(sourceDate.getMinutes());
		destDate.setSeconds(sourceDate.getSeconds());
		return destDate;
	}

	function setNotification(text, time) {
		cordova.plugins.notification.local.schedule({
		    text: text,
		    at: time,
		    led: "FF0000",
		    sound: null
		});
	}

};