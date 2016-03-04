// Handles creating and destroying notifications based upon how
// the data changes. Acts as an intermediary between the application
// and the somewhat difficult to understand LocalNotification api.
var NotificationManager = function(getData, setDataListener) {
	
	// On ready, a budget change, or an options change
	setDataListener(["ready", "tomorrowBudget", "options"], function(type) {
		// destroy and remake all notifications
		// Note: This is surrounded by a try-catch so it won't crash a web browser
		// that cannot access the notification plugin
		var budget = getData('tomorrowBudget');
		if(budget !== null) {
			try {
				cordova.plugins.notification.local.cancelAll(setAllNotifications);
			} catch (e) {
				// console.log("Attempted to set notifications: Budget = " + budget);
				setAllNotifications();
			}
		}
	});

	function setAllNotifications() {
		var options = getData('options');
		var budget = getData('budget');
		var tomorrowBudget = getData('tomorrowBudget');
		var now = new Date();
		var notificationTime;

		// set morning at time if isNotifyMorning
		if(options.isNotifyMorning === 'On') {
			notificationTime = new Date();
			notificationTime = copyTimeOfDay(notificationTime, new Date(options.notifyMorningTime));
			if(notificationTime < now) {
				notificationTime.setDate(notificationTime.getDate() + 1);
				setNotification(1, "Budget", "Your budget is $" + tomorrowBudget, notificationTime);
			} else {
				setNotification(1, "Budget", "Your budget is $" + budget, notificationTime);
			}
		}

		// set night at time if isNotifyNight
		if(options.isNotifyNight === 'On') {
			notificationTime = new Date();
			notificationTime = copyTimeOfDay(notificationTime, new Date(options.notifyNightTime));
			if(notificationTime < now) {
				notificationTime.setDate(notificationTime.getDate() + 1);
				setNotification(2, "Track Spending", "Tap here to track your spending", notificationTime);
			} else {
				setNotification(2, "Track Spending", "Tap here to track your spending", notificationTime);
			}
		}

		// set assets at time and date if isNotifyAssets
		if(options.isNotifyAssets === 'On') {
			notificationTime = new Date();
			if(options.notifyAssetsPeriod === 'Monthly') {
				notificationTime.setDate(1);
				notificationTime.setHours(11);
				notificationTime.setMinutes(0);
				if(notificationTime < now) {
					notificationTime.setMonth(notificationTime.getMonth() + 1);
				}
			} else {
				var currentDay = notificationTime.getDay();
				notificationTime.setDate(notificationTime.getDate() + (7 - currentDay) % 7);
				notificationTime.setHours(11);
				notificationTime.setMinutes(0);
				if(notificationTime < now) {
					notificationTime.setDate(notificationTime.getDate() + 7);
				}
			}
			setNotification(3, "Check Assets", "Remember to check your assets!", notificationTime);
		}
	}

	// Copy the time of day from the sourceDate to the destDate and return destDate
	function copyTimeOfDay(destDate, sourceDate) {
		var returnDate = new Date(destDate);
		returnDate.setHours(sourceDate.getHours());
		returnDate.setMinutes(sourceDate.getMinutes());
		returnDate.setSeconds(sourceDate.getSeconds());
		return returnDate;
	}

	// Wrapper around cordova's notification setting api
	function setNotification(id, title, text, time) {
		try {
			cordova.plugins.notification.local.schedule({
			    id: id,
	            title: title,
	            text: text,
	            at: time,
			});
		} catch (e) {
			console.log("Setting Notification for time " + time);
		}
	}

};

            