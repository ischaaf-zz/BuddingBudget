var NotificationManager = function() {

	var budget = angular.module('budgetData');

	// watch data for any changes, schedule notifications if they happen
	budget.controller('notificationController', ['$scope', 'data', function($scope, data) {
		setWatch($scope, data.getData, 'assets', 'assets', setNotification);
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

	function setNotification(newVal, oldVal, type) {
		var now = new Date().getTime(),
        future = new Date(now + 100);

        cordova.plugins.notification.local.schedule({
            id: 1,
            title: type + ' CHANGED',
            text: type + ' CHANGED FROM ' + oldVal + " TO " + newVal,
            at: future,
            badge: 42
        });
	}

};