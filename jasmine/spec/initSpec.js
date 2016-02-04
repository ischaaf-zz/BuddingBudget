describe("Calculator", function() {
  var calc;

  beforeEach(function() {
    calc = new Calculator();
  });

  it("should correctly return assets (for now)", function() {
    expect(calc.calculateBudget({assets: 5})).toEqual(5);
  });

});
