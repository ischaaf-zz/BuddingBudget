// Handles creating and destroying notifications based upon how
// the data changes. Acts as an intermediary between the application
// and the somewhat difficult to understand LocalNotification api.
var NotificationManager = function(getData, setDataListener) {
	
	// On ready, a budget change, or an options change
	setDataListener(["ready", "tomorrowBudget", "options"], function(type) {
		// destroy and remake all notifications
		// Note: This is surrounded by a try-catch so it won't crash a web browser
		// that cannot access the notification plugin
		try {
			cordova.plugins.notification.local.clearAll(setAllNotifications);
		} catch (e) {
			console.log("Attempted to set notifications: Budget = " + getData('tomorrowBudget'));
		}
	});

	function setAllNotifications() {
		var options = getData('options');
		var budget = getData('tomorrowBudget');
		var time;

		// set morning at time if isNotifyMorning
		if(options.isNotifyMorning === 'On') {
			time = new Date();
			time.setDate(time.getDate() + 1);
			time = copyTimeOfDay(time, new Date(options.notifyMorningTime));
			setNotification(1, "Budget", "Your budget is $" + budget, time);
		}

		// set night at time if isNotifyNight
		if(options.isNotifyNight === 'On') {
			time = new Date();
			time = copyTimeOfDay(time, new Date(options.notifyNightTime));
			setNotification(2, "Track Spending", "Tap here to track your spending", time);
		}

		// set assets at time and date if isNotifyAssets
		if(options.isNotifyAssets === 'On') {
			time = new Date();
			time.setDate(1);
			if(time < (new Date())) {
				time.setMonth(time.getMonth() + 1);
			}
			time.setHour(9);
			time.setMinutes(0);
			setNotification(3, "Check Assets", "Remember to check your assets!", time);
		}
	}

	// Copy the time of day from the sourceDate to the destDate and return destDate
	function copyTimeOfDay(destDate, sourceDate) {
		destDate.setHours(sourceDate.getHours());
		destDate.setMinutes(sourceDate.getMinutes());
		destDate.setSeconds(sourceDate.getSeconds());
		return destDate;
	}

	// Wrapper around cordova's notification setting api
	function setNotification(id, title, text, time) {
		cordova.plugins.notification.local.schedule({
		    id: id,
            title: title,
            text: text,
            at: time,
		});
	}

};

            