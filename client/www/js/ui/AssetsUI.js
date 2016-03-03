function AssetsUI(getData, setDataListener, notifyListeners) {

	$("#buttonAssets").click(function() {
		notifyAssets();
		document.getElementById("setAssets").value = "";
	});
	
	function notifyAssets() {
		notifyListeners("updateAssets", [parseInt($("#setAssets").val()), function() {
		   $("#titleText").notify("CHANGED ASSETS SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
		}, function(message) {
			$("#titleText").notify('FAILED: ' + message, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
		}]);
	}
	
	setDataListener("assets", function() {
		var val = getData("assets");
		if(val >= 0) {
			$("#prevAssets").removeClass("red");
			$("#prevAssets").html("$" + val);
		} else {
			val = val * -1;
			$("#prevAssets").addClass("red");
			$("#prevAssets").html("-$" + val);
		}
	});

	//load assets
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