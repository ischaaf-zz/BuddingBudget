// Notifies listeners when we've reached a new day, either by entering it while the
// app is open, or if the app was closed and reopened on different days.

var DateManager = function() {

	// The last time a date check was performed
	var lastTouched;
	
	var callbacks = [];

	this.registerListener = function(callback) {
		callbacks.push(callback);
	};

	// Pulls lastTouched from local storage and starts the checkDate loop
	this.start = function(cb) {
		localforage.ready(function() {
			localforage.getItem('lastTouched', function(err, val) {
				if(val !== null) {
					lastTouched = new Date(val);
				} else {
					lastTouched = new Date();
				}
				checkDate();
				callFunc(cb);
			});
		});
	};

	// Checks if we're not in the same day as when we last touched the date
	// If we are not, notify listeners
	// Regardless, set a timer for the end of today, and update lastTouched to now
	function checkDate() {
		var now = new Date();
		if(!isSameDay(now, lastTouched)) {
			notifyListeners();
		}
		lastTouched = now;
		localforage.setItem('lastTouched', lastTouched.getTime());
		setTimeout(checkDate, MILLISECONDS_PER_DAY + 60000 - lastTouched.getTime() % MILLISECONDS_PER_DAY);
	}

	function notifyListeners() {
		for(var i = 0; i < callbacks.length; i++) {
			callbacks[i]();
		}
	}

};