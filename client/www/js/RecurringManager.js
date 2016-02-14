var RecurringManager = function(updateAssets, updateCharges, updateIncome) {
	
	var charges = [];
	var income = [];

	this.setCharges = function(value) {
		charges = deepCopy(value);
	};

	this.setIncome = function(value) {
		income = deepCopy(value);
	};

	// THIS CLASS NEEDS TO DETERMINE IF WE ARE AT OR PAST
	// ANY OF THE nextTime VALUES IN A CHARGE OR INCOME
	// AND CHANGE ASSETS / THE nextTime VALUE ACCORDINGLY.
	// SHOULD ALSO MANAGE SETTING NOTIFICATIONS FOR CONFIRMING
	// THE CHARGE.

};