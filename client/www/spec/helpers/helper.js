var today = new Date();

var simpleSampleData = {
	budget: 3,
	assets: 20,
	endDate: new Date(today.getTime() + 86400000 * 3), // 3 days from now
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
		amount: 600,
		period: "monthly",
		start: 1,
		isConfirm: true
	}],
	trackEntries: [],
	options: {}
};