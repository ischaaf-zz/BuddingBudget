var DataManager = function() {

	var calculator = new Calculator();

	// Representation of the user's data - a cache of the
	// data stored in localStorage / network storage
	var data = {
		budget: 0,
		assets: 0,
		endDate: 0,
		savings: [],
		charges: [],
		income: [],
		trackEntries: [],
		options: {}
	};

	// events: ready, one per data type
	var callbacks = {};

	// if the data is of a valid category, and the type of the newData
	// is the same as the type stored, sets the data, recalculates the
	// budget, and notifies appropriate listeners.
	this.setData = function(category, newData) {
		if((category in data) && (typeof(data[category]) === typeof(newData))) {
			var oldBudget = data.budget;
			data[category] = newData;
			data.budget = calculator.calculateBudget(data);
			if(data.budget != oldBudget) {
				notifyListeners("budget");
			}
			notifyListeners(category);
		}
	};

	// Gets the data of the given category
	this.getData = function(category) {
		return data[category]
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
		notifyListeners("ready");
	};

	// Notifies all listeners for event with the first argument
	// event, followed by the arguments in args
	function notifyListeners(event, args) {
		args = args || [];
		args.unshift(event);
		var callbackArr = callbacks[event] || [];
		for(var i = 0; i < callbackArr.length; i++) {
			callbackArr[i].apply(window, args);
		}
	}

}