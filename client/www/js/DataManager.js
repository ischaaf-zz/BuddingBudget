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
		rollover: 0, // The rollover that should be applied to today's budget
		tomorrowRollover: 0, // The rollover that should be applied to tomorrow's budget
		// Note: "Tomorrow" refers to whatever the next day the user uses the app, not literally tomorrow
		assets: 0,
		endDate: 0,
		savings: [],
		charges: [],
		income: [],
		trackedEntry: {}, // Only store today's tracked entry
		options: {}
	};

	// events: ready, one per field in data
	var callbacks = {};

	// if the data is of a valid category, and the type of the newData
	// is the same as the type stored, sets the data, recalculates the
	// budget, and notifies appropriate listeners.
	// Returns true if insertion succeeded, false if it failed
	this.setData = function(category, newData, skipRecalculation) {
		if(!(category in data)) {
			return false;
		}
		// if the data is the correct type - last sanity check before insertion
		var notXorArray = (data[category].constructor === Array) === (newData.constructor === Array);
		if(notXorArray && (typeof(data[category]) === typeof(newData))) {
			var oldBudget = data.budget;
			var oldTomorrowBudget = data.tomorrowBudget;
			data[category] = deepCopy(newData);
			// Keeps us from doing a bunch of unnecessary budget calculations while populating
			// initial data
			if(isStarted) {
				// Should be true if this insertion is an intermediate step in a larger process -
				// for example, deducting assets as part of tracking spending
				if(!skipRecalculation) {
					data.budget = calculator.calculateBudget(data);
					if(data.budget != oldBudget) {
						notifyListeners("budget");
					}
					data.tomorrowBudget = calculator.calculateTomorrowBudget(data);
					if(data.tomorrowBudget != oldTomorrowBudget) {
						notifyListeners("tomorrowBudget");
					}
				}
			}
			notifyListeners(category);
			return true;
		}
		return false;
	};

	// Gets the data of the given category
	this.getData = function(category) {
		return deepCopy(data[category]);
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
		data.budget = calculator.calculateBudget(data);
		data.tomorrowBudget = calculator.calculateTomorrowBudget(data);
		isStarted = true;
		notifyListeners("ready");
	};

	// Get a keyset of data. Used to know what entry names to pull from
	// localforage and network storage
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

};