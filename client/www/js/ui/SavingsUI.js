function SavingsUI(getData, entryHelpers) {

	$("#addSavings").click(function() {
		var savingsName = document.getElementById("newSavingsName").value;
		document.getElementById("newSavingsName").value = "";
		if(savingsName === null || savingsName === "") {
			return;
		}

		var savingsValue = document.getElementById("newSavingsValue").value;
		document.getElementById("newSavingsValue").value = "";
		if(savingsValue === null || savingsValue === "") {
			return;
		}

		var uuid = entryHelpers.makeTemplate("savings", savingsName, savingsValue, updateSavingsEntry, "#savingsList");

		var save = new SavingsEntry(savingsName, savingsValue, true);
		entryHelpers.notifyAdd("addEntry", "savings", savingsName, save, uuid);
		$("#page-savings-tutorial").html("NEXT");
	});

	function updateSavingsEntry(uuid, catName) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		if(val === "") {
			return;
		}

		var save = new SavingsEntry(catName, parseInt(val), false);
		entryHelpers.notifyChange("changeEntry", "savings", catName, save, uuid);
		
		if(val >= 0) {
			li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
		}
	}

	$("#newSavingsName").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#newSavingsValue").focus();
		}
	});

	$("#newSavingsValue").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#addSavings").click();
		}
	});

	//load savings
	var arr = getData("savings");
	arr.forEach(function(ctx) {
		//Todo: replace with makeTemplate based on object
		entryHelpers.makeTemplate("savings", ctx.name, ctx.amount, updateSavingsEntry, "#savingsList");
	});

}