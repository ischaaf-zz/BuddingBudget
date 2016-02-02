var NotificationManager = function() {

	var budget = angular.module('budgetData');

	// watch data for any changes, schedule notifications if they happen
	budget.controller('notificationController', ['$scope', 'data', function($scope, data) {
		setWatch($scope, data.getData, 'assets', 'assets', setNotification);
	}]);

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