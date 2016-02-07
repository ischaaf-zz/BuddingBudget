var sampleData = {
	budget: 3,
	assets: 20,
	endDate: new Date(new Date() + 1000000),
	savings: [{
		name: "testSave",
		amount: 300,
		isDefault: true
	}],
	charges: [{
		name: "rent",
		amount: 600,
		period: "monthly",
		start: 1,
		isConfirm: false
	}],
	income: [{
		name: "paycheck",
		amount: 300,
		period: "semiMonthly",
		start: 15,
		isConfirm: true
	}],
	trackEntries: [],
	options: {}
};