var today = new Date();

var simpleSampleData = {
	budget: 3,
	assets: 20,
	endDate: new Date(today.getTime() + 86400000 * 3), // 3 days from now
	savings: [new SavingsEntry('testSave', 300, true)],
	charges: [new ChargeEntry('rent', 600, 'monthly', 1, false)],
	income: [new IncomeEntry('paycheck', 600, 'monthly', 1, 200, true)],
	trackEntries: [],
	options: {}
};