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

	// listens for getFunc called with args to change, calls callback as
	// callback(newValues, oldValues, info)
	// A more convenient interface to set our data watchers
	function setWatch($scope, getFunc, args, info, callback) {
		args = (typeof args == 'object') ? args : [args];
		$scope.$watch(function() {
			return getFunc.apply(window, args)
		}, function(nv, ov, scp) {
			if(nv != ov) {
				callback(nv, ov, info);
			}
		});
	}

};

