describe("RecurringManager", function() {

	var mock, recurringManager;

	beforeEach(function() {
		mock = {
			saveAssets: jasmine.createSpy("saveAssets"),
			saveCharges: jasmine.createSpy("saveCharges").and.callFake(function(a, b) {
				console.log("SUP");
			}),
			saveIncome: jasmine.createSpy("saveIncome")
		};

		spyOn(window, 'setTimeout').and.callThrough();

		recurringManager = new RecurringManager(mock.saveAssets, mock.saveCharges, mock.saveIncome);
	});

	describe("when managing charges", function() {

		beforeEach(function() {
			var charge = new ChargeEntry("testName", 10, "monthly", (new Date()).getDate(), true);
			recurringManager.setCharges([charge]);
		});

		it("should deduct from assets", function() {
			expect(mock.saveAssets).toHaveBeenCalledWith(-10);
		});

		it("should update charges", function() {
			expect(mock.saveCharges).toHaveBeenCalled();
		});

	});

	describe("when managing income", function() {

		beforeEach(function() {
			var income = new IncomeEntry("testName", 10, "monthly", (new Date()).getDate(), 0, true);
			recurringManager.setIncome([income]);
		});

		it("should deduct from assets", function() {
			expect(mock.saveAssets).toHaveBeenCalledWith(10);
		});

		it("should update charges", function() {
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
				nextTime = new Date(entry.nextTime);
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
				prevTime = new Date(entry.nextTime);
				nextTime = new Date(findNextTime(entry));
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
				nextTime = new Date(entry.nextTime);
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
				prevTime = new Date(entry.nextTime);
				nextTime = new Date(findNextTime(entry));
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

	describe("for biweekly reccurence", function() {
		var day;

		beforeEach(function() {
			day = (new Date()).getTime();
			entry = new ChargeEntry("foo", 1, "biweekly", day, false);
		});


		describe("initial nextTime", function() {

			var nextTime;

			beforeEach(function() {
				nextTime = new Date(entry.nextTime);
			});

			it("should be later than or equal to current time", function() {
				expect(nextTime).not.toBeLessThan(today);
			});

			it("should have a day equal to the start day", function() {
				expect(nextTime.getDay()).toEqual(new Date(day).getDay());
			});

		});

		describe("successive nextTime", function() {

			var prevTime;
			var nextTime;

			beforeEach(function() {
				prevTime = new Date(entry.nextTime);
				nextTime = new Date(findNextTime(entry));
			});

			it("should be later than the previous time", function() {
				expect(nextTime).toBeGreaterThan(prevTime);
			});

			it("should have a day equal to the previous day", function() {
				expect(nextTime.getDay()).toEqual(prevTime.getDay());
			});

			it("should be more than seven days in the future", function() {
				expect((nextTime - prevTime) / MILLISECONDS_PER_DAY).toBeGreaterThan(7);
			});

			it("should be less than or equal to fourteen days in the future", function() {
				expect((nextTime - prevTime) / MILLISECONDS_PER_DAY).toBeLessThan(15);
			});

		});
	});

	describe("for twiceMonthly recurrence", function() {
		var date;

		beforeEach(function() {
			date = (new Date()).getDate();
			entry = new ChargeEntry("foo", 1, "twiceMonthly", date, false);
		});

		describe("second nextTime", function() {

			var nextTime;

			beforeEach(function() {
				nextTime = new Date(findNextTime(entry.nextTime));
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
				prevTime = new Date(entry.nextTime);
				entry.nextTime = new Date(findNextTime(entry));
				nextTime = new Date(findNextTime(entry));
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

});