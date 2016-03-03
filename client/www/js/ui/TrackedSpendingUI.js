function TrackedSpendingUI(getData, setDataListener, notifyListeners) {

	var tracked;

	$("#buttonTrack").click(function() {
		var amount = parseInt($("#setTrack").val());
		var budget = getData("budget");
		var day = (new Date()).getTime();
		tracked = new TrackEntry(amount, budget, day);
		
		var spendType = "distribute";
		
		//check if over/under spent
		var overUnder = budget - amount;
		if((overUnder > 0 || overUnder < 0) && amount >= 0) {
			$("#overUnderPopup").popup("open");
		} else {
			notifyTrackSpend(tracked, spendType);
		}
		
		document.getElementById("setTrack").value = "";
	});
	
	//get selected radio button
	$("#submitOverUnder").click(function() {
		var spendType = $("input[name='ou']:checked").val();
		notifyTrackSpend(tracked, spendType);
	});
	
	function notifyTrackSpend(tracked, spendType) {
		notifyListeners("trackSpending", [tracked, spendType, function() {
			$("#titleText").notify("TRACK SPENDING SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
		}, function(message) {
			$("#titleText").notify("FAILURE: " + message, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
		}]);
	}

	//load track spending
	function fetchTrackedEntry() {
		var track = getData("trackedEntry");
		if(typeof track.amount === "undefined" || track.amount === null) {
			$("#prevSpending").html("$0");
			$("#lastUpdateSpending").html("Last Update: Never Set");
		} else {
			$("#prevSpending").html("$" + track.amount);
			$("#lastUpdateSpending").html("Last Update: " + new Date(track.day));
		}
	}
	
	setDataListener("trackedEntry", fetchTrackedEntry);

	fetchTrackedEntry();

}