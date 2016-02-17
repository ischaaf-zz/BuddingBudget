describe("Calculator", function() {

    var calculator;

    beforeEach(function() {
        calculator = new Calculator();
    });

    it('should calculate some number', function() {
        var budget = calculator.calculateBudget(simpleSampleData);
        expect(typeof(budget)).toEqual("number");
    });

    it('should calculate a correct budget', function() {
    	var budget = calculator.calculateBudget(simpleSampleData);
    	expect(budget).toEqual(5);
    });

});