// The general idea of this class is that it needs to populate dataManager
// with initial data upon creation from phonegap's storage, and after that
// needs to keep dataManager, phonegap's storage, and the network storage
// synchronized.

var StorageManager = function(dataManager, networkManager, readyCallback) {

	var self = this;

	// Creates a new recurringManager and gives it the hooks it needs to
	// update data.
	var recurringManager = new RecurringManager(function(val) {
		if(saveData("assets", dataManager.getData('assets') + val, false)) {
			networkManager.updateAssets(dataManager.getData('assets') + val);
		}
	}, function(val, entry) {
		if(saveData("charges", val, true)) {
			networkManager.changeEntry("charges", entry.name, val);
		}
	}, function(val, entry) {
		if(saveData("income", val, true)) {
			networkManager.changeEntry("income", entry.name, val);
		}
	});

	// Creates a new DateManager to be our timekeeper.
	var dateManager = new DateManager();

	// Update assets
	this.updateAssets = function(newVal, skipRecalculation, success, failure) {
		// update network and local storage
		if(saveData('assets', newVal, skipRecalculation)) {
			networkManager.updateAssets(newVal);
		}
		callFunc(success);
	};

	this.setEndDate = function(endDate, success, failure) {
		if(saveData('endDate', endDate)) {
			networkManager.setEndDate(endDate);
		}
		callFunc(success);
	};

	// Create and add new spending entry
	this.trackSpending = function(trackedEntry, extraOption, success, failure) {
		// extraOption is where we want the surplus / deficit to go
		// if rollover, set difference
		// if distribute, change assets
		// if savings, change savings

		var currentEntry = dataManager.getData('trackedEntry');
		var budget = dataManager.getData('budget');
		
		var difference = budget - trackedEntry.amount;
		var amountToDeduct = trackedEntry.amount - (currentEntry.amount || 0);

		if(extraOption === "rollover") {
			//amountToDeduct += (budget - trackedEntry.amount);
			var rollover = budget - trackedEntry.amount;
			if(saveData('tomorrowRollover', rollover, true)) {
				networkManager.setRollover(rollover);
			}
		} else if(extraOption === "savings") {
			// Implement later
			// var savings = dataManager.getData('savings');
			// savings[0].amount += difference;
			// self.changeEntry("savings", savings[0].name, savings[0]);
			// amountToDeduct = trackedEntry.budget;
		} else if(extraOption !== "distribute") {
			callFunc(failure, ["invalid extraOption"]);
			return;
		}

		// Make sure tomorrow's rollover is cleared if we select a non-rollover option
		if(extraOption !== "rollover") {
			if(saveData('tomorrowRollover', 0, true)) {
				networkManager.setRollover(0);
			}
		}

		self.updateAssets(dataManager.getData('assets') - amountToDeduct, true);

		if(saveData('trackedEntry', trackedEntry)) {
			networkManager.trackSpending(trackedEntry);
		}

		callFunc(success, [$.isEmptyObject(currentEntry)]);
	};

	// Set the specified option to a new value
	this.setOption = function(selection, value, success, failure) {
		var options = dataManager.getData('options');
		options[selection] = value;
		if(saveData('options', options)) {
			networkManager.setOption(selection, value);
		}
		callFunc(success);
	};

	// Add a new entry to savings or recurring charges / income
	this.addEntry = function(category, val, success, failure) {
		var data = dataManager.getData(category);
		// If there's already an entry with this name
		if(indexOfData(data, "name", val.name) !== -1) {
			callFunc(failure, ["entry with name " + val.name + " already exists"]);
		} else {
			data.push(val);
			if(saveData(category, data)) {
				networkManager.addEntry(category, val);
			}
			callFunc(success);
		}
	};

	// Change an entry to savings or recurring charges / income
	this.changeEntry = function(category, name, newVal, success, failure) {
		var data = dataManager.getData(category);
		var index = indexOfData(data, "name", name);
		if(index === -1) {
			callFunc(failure, ["entry with name " + name + " does not exist"]);
		} else {
			newVal.nextTime = data[index].nextTime;
			data[index] = newVal;
			if(saveData(category, data)) {
				networkManager.changeEntry(category, name, newVal);
			}
			callFunc(success);
		}
	};

	// Remove an entry from savings or recurring charges / income
	this.removeEntry = function(category, name, success, failure) {
		var data = dataManager.getData(category);
		var index = indexOfData(data, "name", name);
		if(index === -1) {
			callFunc(failure, ["entry with name " + name + " does not exist"]);
		} else {
			data.splice(index, 1);
			if(saveData(category, data)) {
				networkManager.removeEntry(category, name);
			}
			callFunc(success);
		}
	};

	// Saves data to the data cache, phonegap localStorage,
	// and the cloud storage (once we figure that out)
	function saveData(key, val, skipRecalculation) {
		if(dataManager.setData(key, val, skipRecalculation)) {
			if(PERSIST_DATA) {
				localforage.setItem(key, val);
			}
			if(!skipRecalculation) {
				if(key === 'charges') {
					recurringManager.setCharges(val);
				} else if(key === 'income') {
					recurringManager.setIncome(val);
				}
			}
			return true;
		} else {
			// INCORRECT DATA TYPE, DATA NOT INSERTED
			return false;
		}
	}

	// Registers a listener with dateManager that should be called if
	// this is a new day.
	dateManager.registerListener(function() {
		saveData('rollover', dataManager.getData('tomorrowRollover'), true);
		saveData('tomorrowRollover', 0, true);
		saveData('trackedEntry', {}, true);
		recurringManager.newDay();
	});

	// If the budget changes, update tomorrowRollover in our local storage
	dataManager.registerListener('budget', function() {
		saveData('tomorrowRollover', dataManager.getData('tomorrowRollover'), true);
	});

	// Fetch from network storage. If the fetch succeeds and there is new
	// data, replace what we have.
	// In the future, this will need to be expanded.
	if(NETWORK_ENABLED) {
		networkManager.fetchInitialData(function(data) {
			// check against phonegap storage, update phonegap
			// if newer, and dataManager from that.
			for(var key in data) {
				saveData(key, data[key]);
			}
		}, function() {
			console.log("FAILED TO GET NETWORK DATA");
		});

		networkManager.registerListener('saveData', saveData);
	}

	// fetch from Phonegap storage, send each data type to dataManager
	// Then call readyCallback()
	if(PERSIST_DATA) {
		// Populate the data cache with information in
		// phonegap's local storage
		var setUpDataManager = function() {
			var keys = dataManager.getKeySet();
			for(var i = 0; i < keys.length; i++) {
				var isLast = (i === keys.length - 1);
				getFromForage(keys[i], isLast);
			}
		};

		// Get a single key from localforage and insert it into
		// dataManager and recurringManager. If it is the last
		// key, start dateManager and call our ready callback
		var getFromForage = function(key, isLast) {
			localforage.getItem(key, function(err, val) {
				if(val !== null) {
					dataManager.setData(key, val);
					if(key === 'charges') {
						recurringManager.setCharges(val);
					} else if(key === 'income') {
						recurringManager.setIncome(val);
					}
				}
				if(isLast) {
					dateManager.start(readyCallback);
				}
			});
		};

		localforage.ready(function() {
			localforage.getItem('budgetTime', function(err, val) {
				if(val === null || !isToday(new Date(val))) {
					localforage.removeItem('budgetTime', function() {
						localforage.removeItem('budget', setUpDataManager);
					});
				} else {
					setUpDataManager();
				}
			});
		});	
	} else {
		dateManager.start(readyCallback);
	}

};

