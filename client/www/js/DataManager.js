// Handles access to the user data object used by the application

// Is essentially a cache for the data in phonegap storage, as well
// as on the network storage. As far as the UIView and Notifications
// are concerned, this is the only representation of the data.

var DataManager = function() {

	// Calculates our budget based upon the data
	var calculator = new Calculator();

	// DataManager won't fire callbacks unless it's
	// marked as having started
	var isStarted = false;

	// Representation of the user's data - a cache of the
	// data stored in localStorage / network storage
	var data = {
		budget: 0,
		tomorrowBudget: 0,
		rollover: 0,
		tomorrowRollover: 0,
		assets: 0,
		endDate: 0,
		savings: [],
		charges: [],
		income: [],
		trackedEntry: {}, // Only store today's tracked entry
		options: {}
	};

	var isBudgetRestored = false;

	// events: ready, one per data type
	var callbacks = {};

	// if the data is of a valid category, and the type of the newData
	// is the same as the type stored, sets the data, recalculates the
	// budget, and notifies appropriate listeners.
	// Returns true if insertion succeeded, false if it failed
	this.setData = function(category, newData, skipRecalculation) {
		if(!(category in data)) {
			return false;
		}
		clearTrackedEntry();
		var notXorArray = (data[category].constructor === Array) === (newData.constructor === Array);
		if(notXorArray && (typeof(data[category]) === typeof(newData))) {
			var oldBudget = data.budget;
			var oldTomorrowBudget = data.tomorrowBudget;
			data[category] = deepCopy(newData);
			if(isStarted) {
				if(!skipRecalculation) {
					data.budget = calculator.calculateBudget(data);
					if(data.budget != oldBudget) {
						notifyListeners("budget");
					}
				}
				data.tomorrowBudget = calculator.calculateTomorrowBudget(data);
				if(data.tomorrowBudget != oldTomorrowBudget) {
					notifyListeners("tomorrowBudget");
				}
			}
			if(category === 'budget') {
				isBudgetRestored = true;
			}
			notifyListeners(category);
			return true;
		}
		return false;
	};

	// Gets the data of the given category
	this.getData = function(category) {
		// If we have a trackedEntry from a previous day, evict it before returning.
		// We do this here because there's no other place the user's going to be able
		// to see this data, so this is the most efficient place to make this check.
		clearTrackedEntry();
		return (data[category] === undefined) ? undefined : deepCopy(data[category]);
	};

	// Registers a listener for each category in categories
	this.registerListener = function(categories, callback) {
		categories = (typeof(categories) === "string") ? [categories] : categories;
		for(var i = 0; i < categories.length; i++) {
			callbacks[categories[i]] = callbacks[categories[i]] || [];
			callbacks[categories[i]].push(callback);
		}
	};

	// calculates the initial budget and fires a ready event
	this.start = function() {
		clearTrackedEntry();
		if(!isBudgetRestored) {
			data.budget = calculator.calculateBudget(data);
		}
		data.tomorrowBudget = calculator.calculateTomorrowBudget(data);
		isStarted = true;
		notifyListeners("ready");
	};

	this.newDay = function(callback) {
		data.trackedEntry = {};
		data.rollover = data.tomorrowRollover;
		data.tomorrowRollover = 0;
		callback(data.rollover, data.tomorrowRollover);
	}

	this.getKeySet = function() {
		return Object.keys(data);
	};

	// Notifies all listeners for event with the first argument
	// event, followed by the arguments in args
	function notifyListeners(event, args) {
		if(isStarted) {
			args = args || [];
			args.unshift(event);
			var callbackArr = callbacks[event] || [];
			for(var i = 0; i < callbackArr.length; i++) {
				callbackArr[i].apply(window, args);
			}
		}
	}

	// Clears the tracked entry if it is out of date.
	function clearTrackedEntry() {
		// if(!$.isEmptyObject(data.trackedEntry) && !isToday(new Date(data.trackedEntry.day))) {
		// 	data.trackedEntry = {};
		// }
	}

};