function ChargeUI(getData, entryHelpers) {

	$("#addCharge").click(function() {
		var catName = document.getElementById("newChargeName").value;
		document.getElementById("newChargeName").value = "";
		if(catName === null || catName === "") {
			return;
		}

		var uuid = entryHelpers.makeRecurringTemplate("charges", catName, 0, "monthly", undefined, updateChargesEntry, "#chargesList");
		
		//generalize this? SavingsEntry
		//add element to "savings" array
		var save = new ChargeEntry(catName, 0, 'monthly', 1, true);
		entryHelpers.notifyAdd("addEntry", "charges", catName, save, uuid);
		$("#page-charges-tutorial").html("NEXT");
	});

	function updateChargesEntry(uuid, catName) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		var select = li.getElementsByTagName('select')[0];
		var frequency = select.options[select.selectedIndex].value;
		var startDate = li.getElementsByClassName('form-control')[0].value;

		if(val === "") {
			val = li.getElementsByTagName('h2')[0].innerHTML.split("$")[1];
		}

		var save;
		if(frequency == 'monthly') {
			console.log(dateInputToDate(startDate));
			save = new ChargeEntry(catName, val, frequency, dateInputToDate(startDate).getTime(), false);
		} else if(frequency == 'weekly') {
			var newStartDate = new Date(1970, 0, 4 + parseInt(startDate));
			save = new ChargeEntry(catName, val, frequency, newStartDate, false);
		}

		entryHelpers.notifyChange("changeEntry", "charges", catName, save, uuid);
		
		if(val >= 0) {
			li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
			li.getElementsByTagName('input')[0].value = "";
		}
	}

	$("#newChargeName").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#addCharge").click();
		}
	});

	//load recurring charges
	arr = getData("charges");
	arr.forEach(function(ctx) {
		entryHelpers.makeRecurringTemplate("charges", ctx.name, ctx.amount, ctx.period, ctx.start, updateChargesEntry, "#chargesList");
	});

}