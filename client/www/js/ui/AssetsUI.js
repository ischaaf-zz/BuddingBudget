function AssetsUI(getData, setDataListener, notifyListeners, isTutorial) {
	
	function updateAssets(value) {
		notifyListeners("updateAssets", [value, function() {
		   $("#titleText").notify("Successfully changed assets.", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
		   //this is here and not in TutorialUI because it should only show on a successful callback, which is checked here
		   if(isTutorial) {
			   $("#page-assets-tutorial").show();
		   }
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