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

setEndDate(5);