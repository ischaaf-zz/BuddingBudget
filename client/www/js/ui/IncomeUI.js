function IncomeUI(getData, entryHelpers) {

	$("#addIncome").click(function() {
		var incomeName = document.getElementById("newIncomeName").value;
		document.getElementById("newIncomeName").value = "";
		var incomeValue = document.getElementById("newIncomeValue").value;
		document.getElementById("newIncomeValue").value = "";

		entryHelpers.addEntry(incomeName, incomeValue, "income", "monthly", updateIncomeEntry);
	});
	
	function updateIncomeEntry(uuid, catName) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		var select = li.getElementsByTagName('select')[0];
		var frequency = select.options[select.selectedIndex].value;
		var startDate = li.getElementsByClassName('form-control')[0].value;

		if(val === "") {
			val = 0;		
		}
		
		var save;
		if(frequency == 'monthly') {
			save = new IncomeEntry(catName, val, frequency, dateInputToDate(startDate).getTime(), 0, true);
		} else if(frequency == 'weekly') {
			var newStartDate = new Date(1970, 0, 4 + parseInt(startDate));
			save = new IncomeEntry(catName, val, frequency, newStartDate, 0, true);
		}

		entryHelpers.notifyChange("changeEntry", "income", catName, save, uuid);
		
		if(val >= 0) {
			li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
		}
	}

	$("#newIncomeName").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#newIncomeValue").focus();
		}
	});

	$("#newIncomeValue").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#addIncome").click();
		}
	});

	//load recurring income
	arr = getData("income");
	arr.forEach(function(ctx) {
		entryHelpers.makeRecurringTemplate("income", ctx.name, ctx.amount, ctx.period, ctx.start, updateIncomeEntry, "#incomeList");
	});

}