var StorageManager = function() {

	var budget = angular.module('budgetData');
	var networkManager = new NetworkManager();

	function updateEntries(newValues, oldValues, type) {
		alert("DETECTED CHANGE TO " + newValues + " FROM " + oldValues + " ON " + type);
	}

	// watch data for any changes, call above functions
	// appropriately if any.
	budget.controller('storageController', ['$scope', 'data', function($scope, data) {
		setWatch($scope, data.getData, 'assets', 'assets', updateEntries);
	}]);

};

