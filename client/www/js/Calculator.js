// At some point, we could make this just a function within
// DataManager, but I wanted to keep it separate for now
// so we definitely wouldn't have any merge conflicts if
// both get changed.
var Calculator = function() {

	var self = this;

	// Calculates and returns the budget based upon the
	// passed in data.
	// if a tracked entry exists, and rollover is nonzero, add the budget
	// to our asset pool. If it exists, and rollover is zero, add trackedEntry.amount
	// to our asset pool. If it does not exist, continue as normal.
	// NOTE: If it doesn't exist, data.trackedEntry will equal {}, which is not falsey.
	// 		 I recommend using $.isEmptyObject()
	this.calculateBudget = function(data) {
		// calculate budget by basically dividing the assets by the amount of days left and return that value.
		// Because of possible interleving incomes and charges, the algorithm has to be more sophisticated.

		// make sure dates are have no information about the hour, minute, seconds and milliseconds 
		var now = new Date();
		var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		var endDate = new Date(data.endDate);
		endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
		if(!isTodayOrLater(endDate)) {
			return 0;
		}

		// calculate the available assets
		var sumOfSavings = 0;
		for(var i = 0; i < data.savings.length; i++) {
			sumOfSavings += data.savings[i].amount;
		}
		var availableAssets = data.assets - sumOfSavings;

		// calculate all changes that occur due to income and charges and save them in "changes" with the date as the key.
		var changes = {};
		var nextTime;
		var currentDay = new Date(today);
		changes[currentDay.getTime()] = availableAssets;
		for(i = 0; i < data.income.length; i++) {
			currentDay = new Date(today);
			while(findNextTime(data.income[i], currentDay) <= endDate.getTime()) {
				nextTime = findNextTime(data.income[i], currentDay);
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
		// sort date keys in changes - decreasing
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
		// TODO: error if negative at end

		// sort date keys in changes again after deleting entries, this time increasing
		dates = [];
		for(var dateKey in changes) {
			dates.push(dateKey);
		}
		dates.sort();

		return maxAmountToSpend(changes, endDate);

		// calculates the maximum amount one can spend on the first day to still be able
		// to get to endDate optimally
		function maxAmountToSpend(changes, endDate) {
			// We assume we would have all the income on our begin date and sum up all the incomes.
			var amountAvailable = 0;
			for(var i = 0; i < dates.length; i++) {
				if(dates[i] > endDate.getTime()) {
					break;
				}
				amountAvailable += changes[dates[i]];
			}

			// Check how long one can use the daily amount until one runs out of money. If that is the end date
			// output the daily amount. Else try again with not all the incomes available, but only the ones 
			// until the point we previously had no more money left.
			var differenceMilliseconds = endDate - today;
			var differenceDays = Math.round(differenceMilliseconds / MILLISECONDS_PER_DAY) + 1;
			var dailyAmount = amountAvailable / differenceDays;
			var lastDatePossible = getLastDayPossible(dailyAmount);
			if(lastDatePossible >= endDate) {
				return Math.floor(dailyAmount);
			} else {
				return maxAmountToSpend(changes, lastDatePossible);
			}

			// simulate how long the dailyAmount will last with the assets as well as all the incomes.
			function getLastDayPossible(dailyAmount) {
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

	// calculate tomorrow's budget
	// If a trackedEntry exists, consider the current assets to be
	// the assets you will have tomorrow. Otherwise, subtract the current
	// budget from the assets pool. Make sure you don't actually modify
	// the data object though.
	// Add rollover to whatever budget is calculated
	this.calculateTomorrowBudget = function(data) {
		return parseInt(50 * Math.random());
	};

};