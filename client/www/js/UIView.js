// THIS FILE SHOULD BE THE ONLY PLACE THE DOM IS MANIPULATED

var UIView = function(getData, setDataListener) {

	// events: updateAssets, trackSpending, setOption, 
	//		   addEntry, changeEntry, removeEntry
	var callbacks = {};

	this.registerCallback = function(event, callback) {
		callbacks[event] = callbacks[event] || [];
		callbacks[event].push(callback);
	};

	function notifyListeners(event, args) {
		var callbackArr = callbacks[event] || [];
		for(var i = 0; i < callbackArr.length; i++) {
			callbackArr[i].apply(window, args);
		}
	}

	// update budget when budget changes
	setDataListener("budget", function() {
		$("#budget").html(getData("budget"));
	});
	
	$("#setAssets").click(function() {
		notifyListeners("updateAssets", [parseInt($("#amount").val()), function() {
			$("#assetsSuccess").html("CHANGED ASSETS SUCCESS");
		}, function(message) {
			$("#assetsSuccess").html("FAILED: " + message);
		}]);
	});

};