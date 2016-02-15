describe("RecurringManager", function() {

	var mock, recurringManager;

	beforeEach(function() {
		mock = {
			saveAssets: jasmine.createSpy("saveAssets"),
			saveCharges: jasmine.createSpy("saveCharges"),
			saveIncome: jasmine.createSpy("saveIncome")
		};

		recurringManager = new RecurringManager(mock.saveAssets, mock.saveCharges, mock.saveIncome);

	});

	describe("when managing charges", function() {

		beforeEach(function() {
			var charge = new ChargeEntry("testName", 10, "monthly", (new Date()).getDate(), true);
			recurringManager.setCharges([charge]);
		});

		it("timeout should deduct from assets", function() {
			expect(mock.saveAssets).toHaveBeenCalledWith(-10);
		});

		it("timeout should update charges", function() {
			expect(mock.saveCharges).toHaveBeenCalled();
		});

	});

	describe("when managing income", function() {

		beforeEach(function() {
			var income = new IncomeEntry("testName", 10, "monthly", (new Date()).getDate(), 0, true);
			recurringManager.setIncome([income]);
		});

		it("timeout should deduct from assets", function() {
			expect(mock.saveAssets).toHaveBeenCalledWith(10);
		});

		it("timeout should update charges", function() {
			expect(mock.saveIncome).toHaveBeenCalled();
		});

	});

});

describe("nextTime management", function() {

	var entry;
	var today = new Date();

	describe("for monthly recurrence", function() {

		var date;

		beforeEach(function() {
			date = (new Date()).getDate();
			entry = new ChargeEntry("foo", 1, "monthly", date, false);
		});

		describe("initial nextTime", function() {

			var nextTime;

			beforeEach(function() {
				nextTime = entry.nextTime;
			});

			it("should be later than or equal to current time", function() {
				expect(nextTime).not.toBeLessThan(today);
			});

			it("should have a date equal to the start date", function() {
				expect(nextTime.getDate()).toEqual(date);
			});

		});

		describe("successive nextTimes", function() {

			var prevTime;
			var nextTime;

			beforeEach(function() {
				prevTime = entry.nextTime;
				nextTime = findNextTime(entry);
			});

			it("should be later than the previous time", function() {
				expect(nextTime).toBeGreaterThan(prevTime);
			});

			it("should have a date equal to the previous date", function() {
				expect(nextTime.getDate()).toEqual(prevTime.getDate());
				expect(nextTime.getDate()).toEqual(date);
			});

		});

	});

	describe("for weekly recurrence", function() {

		var day;

		beforeEach(function() {
			day = (new Date()).getDay();
			entry = new ChargeEntry("foo", 1, "weekly", day, false);
		});


		describe("initial nextTime", function() {

			var nextTime;

			beforeEach(function() {
				nextTime = entry.nextTime;
			});

			it("should be later than or equal to current time", function() {
				expect(nextTime).not.toBeLessThan(today);
			});

			it("should have a day equal to the start day", function() {
				expect(nextTime.getDay()).toEqual(day);
			});

		});

		describe("successive nextTime", function() {

			var prevTime;
			var nextTime;

			beforeEach(function() {
				prevTime = entry.nextTime;
				nextTime = findNextTime(entry);
			});

			it("should be later than the previous time", function() {
				expect(nextTime).toBeGreaterThan(prevTime);
			});

			it("should have a day equal to the previous day", function() {
				expect(nextTime.getDay()).toEqual(prevTime.getDay());
				expect(nextTime.getDay()).toEqual(day);
			});

		});

	});

	// describe("for biweekly reccurence", function() {
	// 	beforeEach(function() {
	// 		entry = new ChargeEntry("foo", 1, "biweekly", 1, false);
	// 	});
	// });

	// describe("for twiceMonthly recurrence", function() {
	// 	beforeEach(function() {
	// 		entry = new ChargeEntry("foo", 1, "twiceMonthly", 1, false);
	// 	});
	// });

});