function SavingsUI(getData, entryHelpers) {

	$("#addSavings").click(function() {
		var catName = document.getElementById("newSavingsName").value;

		document.getElementById("newSavingsName").value = "";

		if(catName === null || catName === "") {
			return;
		}

		var uuid = entryHelpers.makeTemplate("savings", catName, 0, updateSavingsEntry, "#savingsList");

		//generalize this? SavingsEntry
		//add element to "savings" array
		var save = new SavingsEntry(catName, 0, true);
		entryHelpers.notifyAdd("addEntry", "savings", catName, save, uuid);
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
			li.getElementsByTagName('input')[0].value = "";		
		}
	}

	$("#newSavingsName").keyup(function(event) {
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