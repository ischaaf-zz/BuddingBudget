(function() {

	angular.module('budgetData', []);
	angular.module('options', []);
	angular.module('credentials', []);

	angular.module('budgetData').service('data', DataManager);

})();

