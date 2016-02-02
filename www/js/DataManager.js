var DataManager = function() {

	var calculator = new Calculator();
	var data = {
		assets : 5
	};
	
	this.getData = function(type) {
		return data[type];
	};

	this.setData = function(type, newData) {
		data[type] = newData;
	};

	this.getBudget = calculator.calculateBudget(data);

};