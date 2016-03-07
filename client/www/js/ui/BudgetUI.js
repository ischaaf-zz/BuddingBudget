function BudgetUI(getData, setDataListener) {

	function fetchBudget() {
		var budgetString = "$" + getData("budget");
		$("#budget").html(budgetString);

		var length = Math.max(budgetString.length, 3);

		var size = (2400 / length) + "%";
		$("#budget").css('font-size', size);
	}

	setDataListener("budget", fetchBudget);

	fetchBudget();

}