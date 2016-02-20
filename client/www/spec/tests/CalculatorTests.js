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

});