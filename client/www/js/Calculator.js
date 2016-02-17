// At some point, we could make this just a function within
// DataManager, but I wanted to keep it separate for now
// so we definitely wouldn't have any merge conflicts if
// both get changed.
var Calculator = function() {

	// Calculates and returns the budget based upon the
	// passed in data.
	this.calculateBudget = function(data) {
		// calculate budget by dividing the assets by the amount of days left and return that value

		// make sure dates are have no information about the hour, minute, seconds and milliseconds 
		var now = new Date();
		var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		var endDate = new Date(data.endDate);
		endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
		if(!isTodayOrLater(endDate)) {
			return 0;
		}
		var differenceMilliseconds = endDate - today;
		var millisecondsPerDay = 24 * 60 * 60 * 1000;
		// include last day
		var differenceDays = Math.round(differenceMilliseconds / millisecondsPerDay) + 1;
		return Math.floor(data.assets / differenceDays);
	};

};