// The general idea of this class is that it needs to populate dataManager
// with initial data upon creation from phonegap's storage, and after that
// needs to keep dataManager, phonegap's storage, and the network storage
// synchronized.

var StorageManager = function(dataManager, networkManager, readyCallback) {

	// Update assets
	this.updateAssets = function(newVal, success, failure) {
		// update network and local storage
		saveData('assets', newVal);
		callFunc(success);
	};

	this.setEndDate = function(endDate, success, failure) {
		saveData('endDate', endDate);
		callFunc(success);
	};

	// Create and add new spending entry
	this.trackSpending = function(trackedEntry, extraOption, success, failure) {
		// extraOption is where we want the surplus / deficit to go
		// if rollover, set difference
		// if distribute, change assets
		// if savings, change savings
		
		var difference = trackedEntry.budget - trackedEntry.amount;
		var amountToDeduct = trackedEntry.amount;

		if(extraOption === "rollover") {
			// This is harder to implement than I thought it would be. May get
			// pushed past the beta stage
			//
			// dataManager.setData('assets', currentAssets - trackedEntry.amount);
			// dataManager.setData('trackedEntry', trackedEntry);
			// dataManager.setData('nextDayBudget', trackedEntry.budget + difference)
		} else if(extraOption === "savings") {
			var savings = dataManager.getData('savings');
			savings[0].amount += difference;
			saveData('savings', savings);
			amountToDeduct = trackedEntry.budget;
		} else if(extraOption !== "distribute") {
			callFunc(failure, ["invalid extraOption"]);
			return;
		}

		saveData('assets', dataManager.getData('assets') - amountToDeduct);
		saveData('trackedEntry', trackedEntry);

		callFunc(success);
	};

	// Set the specified option to a new value
	this.setOption = function(selection, value, success, failure) {
		var options = dataManager.getData('options');
		options[selection] = value;
		saveData('options', options);
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
			saveData(category, data);
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
			data[index] = newVal;
			saveData(category, data);
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
			saveData(category, data);
			callFunc(success);
		}
	};

	// Saves data to the data cache, phonegap localStorage,
	// and the cloud storage (once we figure that out)
	function saveData(key, val) {
		if(dataManager.setData(key, val)) {
			localforage.setItem(key, val);	
			return true;
		} else {
			// INCORRECT DATA TYPE, DATA NOT INSERTED
			return false;
		}
	}

	// fetch from Phonegap storage, send each data type to dataManager
	// Then call readyCallback()

	networkManager.fetchInitialData(function(data) {
		// check against phonegap storage, update phonegap
		// if newer, and dataManager from that.
	}, function() {
		// Failure callback
	});

	localforage.ready(function() {
		// Populate the data cache with information in
		// phonegap's local storage
		var keys = dataManager.getKeySet();
		for(var i = 0; i < keys.length; i++) {
			(function(key) {
				localforage.getItem(key, function(err, val) {
					if(val !== null) {
						dataManager.setData(key, val);
					}
				});
			})(keys[i]);
		}

		// THIS SHOULD GET CALLED BACK IN PHONEGAP STORAGE'S FETCH
		// CALLBACK INSTEAD ONCE THAT'S SET UP
		readyCallback();
	});

};

