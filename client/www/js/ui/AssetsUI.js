function AssetsUI(getData, setDataListener, notifyListeners) {
	
	function updateAssets(value) {
		notifyListeners("updateAssets", [value, function() {
		   $("#titleText").notify("Successfully changed assets.", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
		   // Replaced other fix with this hacky workaround - The former solution had no way of knowing
		   // whether the tutorial had been skipped or not, and showed the next button even if it had been.
		   notifyListeners('assetsUpdatedSuccess');
		}, function(message) {
			$("#titleText").notify('FAILURE: ' + message, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
		}]);
	}

	function fetchAssets() {
		var val = getData("assets");
		if(val >= 0) {
			$("#prevAssets").removeClass("red");
			$("#prevAssets").html("$" + val);
		} else {
			val = val * -1;
			$("#prevAssets").addClass("red");
			$("#prevAssets").html("-$" + val);
		}
	}

	$("#buttonAssets").click(function() {
		updateAssets(parseInt($("#setAssets").val()));
		document.getElementById("setAssets").value = "";
	});
	
	setDataListener("assets", fetchAssets);

	fetchAssets();

}