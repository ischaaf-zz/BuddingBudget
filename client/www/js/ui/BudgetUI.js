function BudgetUI(getData, setDataListener) {

	function fetchBudget() {
		$("#budget").html("$" + getData("budget"));
	}

	setDataListener("budget", fetchBudget);

	fetchBudget();

}