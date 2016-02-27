var today = new Date();

var simpleSampleData = {
	budget: 3,
	assets: 320,
	rollover: 0,
	endDate: today.getTime() + MILLISECONDS_PER_DAY * 3, // 3 days from now
	savings: [new SavingsEntry('testSave', 300, true)],
	charges: [new ChargeEntry('rent', 600, 'monthly', 1, false)],
	income: [new IncomeEntry('paycheck', 600, 'monthly', 1, 200, true)],
	trackEntries: [],
	options: {}
};

var cordova = {
	plugins : {
		notification : {
			local : {
				schedule : function() {},
				cancelAll : function() {}
			}
		}
	}
};