describe("Calculator", function() {

    var calculator;

    beforeEach(function() {
        var baseTime = new Date(2016, 1, 13);
        jasmine.clock().mockDate(baseTime);
        simpleSampleData.endDate = new Date(2016, 1, 16)
        calculator = new Calculator();
    });

    it('should calculate some number', function() {
        var budget = calculator.calculateBudget(simpleSampleData);
        expect(typeof(budget)).toEqual("number");
    });

    it('should calculate a positive budget', function() {
        var budget = calculator.calculateBudget(simpleSampleData);
        expect(budget).not.toBeLessThan(0);
    });

    it('should calculate a correct budget', function() {
    	var budget = calculator.calculateBudget(simpleSampleData);
    	expect(budget).toEqual(5);
    });
    
    // simulates the budgeting by mocking all days and check that all budgets as well as the final assets are correct
    it('should calculate the right sequence of budgets and use up the available assets', function() {
        jasmine.clock().install();
        var endDate = new Date(simpleSampleData.endDate);
        while(isTodayOrLater(endDate)) {
            console.log(new Date())
            budget = calculator.calculateBudget(simpleSampleData);
            expect(budget).toEqual(5);
            simpleSampleData.assets -= budget;
            jasmine.clock().tick(MILLISECONDS_PER_DAY); // next day
        }
        expect(simpleSampleData.assets).toEqual(300);
        jasmine.clock().uninstall();
    });

    it('should ouput optimal budget including interleaving income and charges', function() {
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + 20);
        var complexSampleData = {
            budget: 0,
            assets: 1100,
            endDate: endDate.getTime(),
            savings: [new SavingsEntry('testSave', 600, true)],
            charges: [new ChargeEntry('rent', 500, 'monthly', 1, false), new ChargeEntry('weeklyCharges', 50, 'weekly', 3, false)],
            income: [new IncomeEntry('paycheck', 950, 'monthly', 1, 200, true)],
            trackEntries: [],
            options: {}
        };

        /* Expected Rundown:
         * 2016-02-13: 500 available assets
         * 2016-02-17: -50 weekly
         * 2016-02-24: -50 weekly
         * 2016-03-01: +750 paycheck, -500 rent
         * 2016-03-02: -50 weekly
         * 2016-03-04: endDate
         *
         * Expected Budget:
         * 2016-02-13 to 29: 400/17 = 23.5
         * 2016-03-01 to 04: 200/4 = 50
         */

        jasmine.clock().install();
        while(isTodayOrLater(endDate)) {
            console.log(new Date())
            budget = calculator.calculateBudget(complexSampleData);
            console.log(budget);
            //expect(budget).toEqual(5);
            complexSampleData.assets -= budget;
            jasmine.clock().tick(MILLISECONDS_PER_DAY); // next day
            if(new Date().getDate() == 17 || new Date().getDate() == 24 || new Date().getDate() == 2) {
                complexSampleData.assets -= 50;
            }
            if(new Date().getDate() == 1) {
                complexSampleData.assets += 250;
            }
            // TODO: replace if statements with simulating recurring charges
            // TODO: add expects
        }
        expect(complexSampleData.assets).toEqual(600);
        jasmine.clock().uninstall();
    });

});