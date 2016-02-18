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

		var sumOfSavings = 0;
		for(var i = 0; i < data.savings.length; i++) {
			sumOfSavings += data.savings[i].amount;
		}
		var availableAssets = data.assets - sumOfSavings;

		changes[currentDay.getTime()] = availableAssets;
		for(i = 0; i < data.income.length; i++) {
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
		for(i = 0; i < data.charges.length; i++) {
			currentDay = new Date(today);
			while(findNextTime(data.charges[i], currentDay) <= endDate.getTime()) {
				nextTime = findNextTime(data.charges[i], currentDay);
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
		var dates = [];
		for(var date in changes) {
			dates.push(date);
		}
		dates.sort().reverse();

		// compensate negative income days with earlier positive income to get rid of them
		var compensationAmount = 0;
		for(i = 0; i < dates.length; i++) {
			changes[dates[i]] += compensationAmount;
			compensationAmount = 0;
			if(changes[dates[i]] <= 0) {
				compensationAmount += changes[dates[i]];
				delete changes[dates[i]];
			}
		}
		console.log(changes);
		// TODO: error if negative at end

		// sort date keys in changes again after deleting entries
		dates = [];
		for(var date in changes) {
			dates.push(date);
		}
		dates.sort();

		return maxAmountToSpend(changes, endDate);

		function maxAmountToSpend(changes, endDate) {
			// Concat income
			var amountAvailable = 0;
			for(var i = 0; i < dates.length; i++) {
				if(dates[i] > endDate.getTime()) {
					break;
				}
				amountAvailable += changes[dates[i]];
			}

			// see where it goes below 0
			var differenceMilliseconds = endDate - today;
			var differenceDays = Math.round(differenceMilliseconds / MILLISECONDS_PER_DAY) + 1;
			var dailyAmount = amountAvailable / differenceDays;
			var lastDatePossible = amountPossible(dailyAmount);
			if(lastDatePossible >= endDate) {
				return Math.floor(dailyAmount);
			} else {
				return maxAmountToSpend(changes, lastDatePossible);
			}

			function amountPossible(dailyAmount) {
				var amountAvailable = availableAssets;
				var lastDate = today;
				for(var i = 0; i < dates.length; i++) {
					var differenceMilliseconds = dates[i] - lastDate;
					// TODO: check if +1 needed for inclusive end date
					var differenceDays = Math.round(differenceMilliseconds / MILLISECONDS_PER_DAY);
					lastDate = dates[i];
					amountAvailable -= dailyAmount * differenceDays;
					if(amountAvailable < 0) {
						lastDate.setDate(lastDate.getDate - 1);
						return lastDate;
					}
					amountAvailable += changes[dates[i]];
				}
				return endDate;
			}
		}
	};

};