function setTempData() {
	var savingsArray = [];
	savingsArray.push(new SavingsEntry("test1", 20, true));
	savingsArray.push(new SavingsEntry("test2", 100, false));

	var chargesArray = [];
	chargesArray.push(new ChargeEntry("test1", 20, "monthly", 1, false));
	chargesArray.push(new ChargeEntry("test2", 40, "weekly", 6, true));

	var incomeArray = [];
	incomeArray.push(new IncomeEntry("test1", 20, "weekly", 4, 5, true));
	incomeArray.push(new IncomeEntry("test2", 40, "monthly", 1, 0, false));

	dataManager.setData('assets', 33);
	dataManager.setData('endDate', (new Date()).getTime());
	dataManager.setData('savings', savingsArray);
	dataManager.setData('charges', chargesArray);
	dataManager.setData('income', incomeArray);
	
	var trackEntry = new TrackEntry();
}

function setEndDate(daysInFuture) {
	storageManager.setEndDate((new Date()).getTime() + (24 * 60 * 60 * 1000 * daysInFuture));
}

function setTime(days) {
	localforage.setItem('daysInFuture', days);
}

// Makes the app think that it's daysInFuture away from the real today
function timeTravel(daysInFuture) {
	window.OtherDate = Date;
	Date = function() {
		if(arguments.length == 0 || arguments[0] === undefined) {
			var data = (new OtherDate()).getTime() + (daysInFuture * MILLISECONDS_PER_DAY);
			return(new OtherDate(data));
		}

		var args = [];
		for(var i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		var date = new (Function.prototype.bind.apply(OtherDate, [null].concat(args)))

		return date;
	}
}

function setUpFutureDate() {
	var simuDate = new Date();

	$("#futureDate").val(simuDate.getFullYear() + "-" + padDigits(simuDate.getMonth() + 1, 2) + "-" + padDigits(simuDate.getDate(), 2));

	$("#futureDate").change(function() {
		var now = window.OtherDate ? new OtherDate() : new Date();
		var future = dateInputToDate($(this).val());
		setTime(Math.ceil((future - now) / MILLISECONDS_PER_DAY));
	});
}