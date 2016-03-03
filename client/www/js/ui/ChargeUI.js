function ChargeUI(getData, entryHelpers) {

	$("#addCharge").click(function() {
		var chargeName = document.getElementById("newChargeName").value;
		document.getElementById("newChargeName").value = "";
		if(chargeName === null || chargeName === "") {
			return;
		}

		var chargeValue = document.getElementById("newChargeValue").value;
		document.getElementById("newChargeValue").value = "";
		if(chargeValue === null || chargeValue === "") {
			return;
		}

		var today = new Date();

		var uuid = entryHelpers.makeRecurringTemplate("charges", chargeName, chargeValue, "monthly", today, updateChargesEntry, "#chargesList");
		
		var save = new ChargeEntry(chargeName, chargeValue, 'monthly', today, true);
		entryHelpers.notifyAdd("addEntry", "charges", chargeName, save, uuid);
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
		}
	}

	$("#newChargeName").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#newChargeValue").focus();
		}
	});

	$("#newChargeValue").keyup(function(event) {
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