describe("Calculator", function() {

    var calculator;

    beforeEach(function() {
        calculator = new Calculator();
    });

    it('should calculate some number', function() {
        var budget = calculator.calculateBudget(sampleData);
        expect(typeof(budget)).toEqual("number");
    });

});