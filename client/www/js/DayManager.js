var DateManager = function() {

	var lastTouched;
	
	var callbacks = [];

	this.registerListener = function(callback) {
		callbacks.push(callback);
	};

	this.start = function() {
		localforage.ready(function() {
			localforage.getItem('lastTouched', function(err, val) {
				lastTouched = new Date(val);
				checkDate();
			});
		});
	}

	function notifyListeners() {
		for(var i = 0; i < callbacks.length; i++) {
			callbacks[i]();
		}
	}

	function checkDate() {
		var now = new Date();
		if(!isSameDay(now, lastTouched)) {
			notifyListeners();
		}
		lastTouched = now;
		saveDate(lastTouched.getTime());
		setTimeout(checkDate, MILLISECONDS_PER_DAY + 60000 - lastTouched.getTime() % MILLISECONDS_PER_DAY);
	}

	function saveDate(date) {
		localforage.setItem('lastTouched', date);
	}

}