function BudgetUI(getData, setDataListener) {

	setDataListener("budget", function() {
		$("#budget").html("$" + getData("budget"));
	});
	
	//for testing?
	$("#resetStorage").click(function() {
		clearStorage();
		$("#resetNote").html("Storage cleared. Reload/reopen app to see default state.");
	});

	$("#budget").html("$" + getData("budget"));

}