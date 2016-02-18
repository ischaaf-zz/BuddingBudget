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

		// calculate all changes that occur due to income and charges and save them in "changes".
		var changes = {};
		var currentDay = new Date(today);
		changes[currentDay.getTime()] = data.assets;
		for(var i = 0; i < data.income.length; i++) {
			currentDay = new Date(today);
			while(findNextTime(data.income[i], currentDay) <= endDate.getTime()) {
				var nextTime = findNextTime(data.income[i], currentDay);
				if(changes[nextTime]) {
					changes[nextTime] += data.income[i].amount;
				} else {
					changes[nextTime] = data.income[i].amount;
				}
				currentDay = new Date(nextTime);
			}
		}
		for(var i = 0; i < data.charges.length; i++) {
			currentDay = new Date(today);
			while(findNextTime(data.charges[i], currentDay) <= endDate.getTime()) {
				var nextTime = findNextTime(data.charges[i], currentDay);
				if(changes[nextTime]) {
					changes[nextTime] -= data.charges[i].amount;
				} else {
					changes[nextTime] = -data.charges[i].amount;
				}
				currentDay = new Date(nextTime);
			}
		}
		console.log(changes);
		// sort date keys in changes
		dates = [];
		for(var date in changes) {
			dates.push(date);
		}
		dates.sort().reverse();

		// compensate negative income days with earlier positive income to get rid of them
		var compensationAmount = 0;
		for(var i = 0; i < dates.length; i++) {
			changes[dates[i]] += compensationAmount;
			compensationAmount = 0;
			if(changes[dates[i]] <= 0) {
				compensationAmount += changes[dates[i]];
				delete changes[dates[i]];
			}
		}
		console.log(changes);
		// TODO: error if negative at end

		//return maxAmountToSpend(changes, endDate);

		function maxAmountToSpend(changes, endDate) {
			// TODO
		}

		var differenceMilliseconds = endDate - today;
		// include last day
		var differenceDays = Math.round(differenceMilliseconds / MILLISECONDS_PER_DAY) + 1;
		return Math.floor(data.assets / differenceDays);
	};

};