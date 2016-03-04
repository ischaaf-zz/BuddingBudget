function OptionsUI(getData, setDataListener, notifyListeners, isTutorial) {

	function init() {
		var value = getData("options");
		
		//flip switches
		if(value.isNotifyMorning == 'On') {
			$("#morningNotice").val("On").flipswitch("refresh");
			$("#budgetTime").attr('disabled', false);
		} else {
			$("#budgetTime").attr('disabled', true);
		}
		
		if(value.isNotifyNight == 'On') {
			$("#nightNotice").val("On").flipswitch("refresh");
			$("#trackTime").attr('disabled', false);
		} else {
			$("#trackTime").attr('disabled', true);
		}
		
		if(value.isNotifyAssets == 'On') {
			$("#assetNotice").val("On").flipswitch("refresh");
			$("#selectAssetNotice").selectmenu('enable');
		} else {
			$("#selectAssetNotice").selectmenu('disable');
		}
		
		//load budget notification time
		if(value.notifyMorningTime !== undefined) {
			var budgetTime = value.notifyMorningTime;
			var newDateA = new Date(budgetTime);
			$("#budgetTime").val(dateToTimeInput(newDateA));
		}
		
		//load tracking reminder time
		if(value.notifyNightTime !== undefined) {
			var trackTime = value.notifyNightTime;
			var newDateB = new Date(trackTime);
			$("#trackTime").val(dateToTimeInput(newDateB));
		}
		
		//load asset update reminder period
		if(value.notifyAssetsPeriod !== undefined) {
			$("#selectAssetNotice option[value='" + value.notifyAssetsPeriod + "']").attr("selected", "selected");
			$("#selectAssetNotice").selectmenu('refresh', true);
		}
		
		//load end date
		var theDate = getData("endDate");
		var newDate = new Date(theDate);
		$("#endDate").val(dateToDateInput(newDate));
	}

	setDataListener("options", function() {
		var value = getData("options");
		
		$("#minBudget").html("$" + value.minDailyBudget);
		
		if(value.isNotifyMorning == 'On') {
			$("#budgetTime").attr('disabled', false);
		} else {
			$("#budgetTime").attr('disabled', true);
		}
		
		if(value.isNotifyNight == 'On') {
			$("#trackTime").attr('disabled', false);
		} else {
			$("#trackTime").attr('disabled', true);
		}
		
		if(value.isNotifyAssets == 'On') {
			$("#selectAssetNotice").selectmenu('enable');
		} else {
			$("#selectAssetNotice").selectmenu('disable');
		}
	});	
	
	$("#assetNotice").change(function() {
		var label = $("#assetNotice").val();
		notifyListeners("setOption", ["isNotifyAssets", label, function() {
			//success
		}, function(message) {
			//failure
		}]);
	});
	
	$("#nightNotice").change(function() {
		var label = $("#nightNotice").val();
		notifyListeners("setOption", ["isNotifyNight", label, function() {
			//success
		}, function(message) {
			//failure
		}]);
	});
	
	$("#morningNotice").change(function() {
		var label = $("#morningNotice").val();
		notifyListeners("setOption", ["isNotifyMorning", label, function() {
			//success
		}, function(message) {
			//failure
		}]);
	});
	
	$("#buttonMinDaily").click(function() {
		notifyListeners("setOption", ["minDailyBudget", parseInt($("#setMinBudget").val()), function() {
			//success
		}, function(message) {
			//failure
		}]);
	});
	
	$("#selectAssetNotice").change(function() {
		notifyListeners("setOption", ["notifyAssetsPeriod", $("#selectAssetNotice option:selected" ).text(), function() {
			//sucess
		}, function(message) {
			//failure
		}]);
	});
	
	$("#endDate").change(function() {
		notifyListeners("setEndDate", [dateInputToDate($(this).val()).getTime(), function() {
			//console.log("SUCCESS: " + $("#endDate").val());
			if(isTutorial) {
				$("#page-options-tutorial").show();
				isTutorial = false;
			}
		}, function(message) {
			$("#endDate").notify("FAILURE: " + message);
		}]);
	});
	
	$("#budgetTime").change(function() {
		var val = timeInputToDate($("#budgetTime").val()).getTime();
		
		notifyListeners("setOption", ["notifyMorningTime", val, function() {
			//success
		}, function(message) {
			//failure
		}]);
	});
	
	$("#trackTime").change(function() {
		var val = timeInputToDate($("#trackTime").val());
		
		notifyListeners("setOption", ["notifyNightTime", val, function() {
			//success
		}, function(message) {
			//failure
		}]);
	});	

	init();

}