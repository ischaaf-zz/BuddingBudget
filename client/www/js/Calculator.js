// At some point, we could make this just a function within
// DataManager, but I wanted to keep it separate for now
// so we definitely wouldn't have any merge conflicts if
// both get changed.
var Calculator = function() {

	this.calculateBudget = function(data) {
		// calculate budget and return
		return data.assets / 5
	};

};