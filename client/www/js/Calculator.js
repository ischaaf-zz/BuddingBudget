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
		// check that endDate is set
		if(!data.endDate) {
			return 0;
		}
		var endDate = new Date(data.endDate.getFullYear(), data.endDate.getMonth(), data.endDate.getDate());
		// check that endDate is later than today
		if(endDate <= today) {
			return 0;
		}
		var differenceMilliseconds = endDate - today;
		var millisecondsPerDay = 24 * 60 * 60 * 1000;
		var differenceDays = Math.round(differenceMilliseconds / millisecondsPerDay);
		return Math.floor(data.assets / differenceDays);
	};

};