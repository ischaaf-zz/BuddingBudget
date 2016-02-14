// THIS FILE SHOULD BE THE ONLY PLACE THE DOM IS MANIPULATED
// Handles sending new data and commands out from the DOM, and
// putting new updated data into the DOM.

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
	
	//if PERSIST_DATA in utility.js is set to false temp data will be set here
	$(document).ready(function() {
		setTempData();
	});
	
	// update budget when budget changes
	setDataListener("budget", function() {
		$("#budget").html("$" + getData("budget"));
	});
	
	setDataListener("assets", function() {
		$("#prevAssets").html("$" + getData("assets"));
	});
	
	// setup savings and update when there are changes
	// warning: currently dependant on SavingsEntry internals
	setDataListener("savings", function() {
		getData("savings").forEach(function(ctx) {
			$("#savingsList").append('<li id ="'+ ctx["name"] + '"><h3>' + ctx["name"] + '</h3><input id="' + ctx["amount"] + '" data-controller="input-value" type="number" min = "0"><button id=button"' + ctx["name"] + '">Update</button></li>');
		});
	});
	
	$("#buttonAssets").click(function() {
		notifyListeners("updateAssets", [parseInt($("#setAssets").val()), function() {
			//$("#prevAssets").html("$" + getData(assets));
			//$("#prevAssets").html("$" + $("#setAssets").val());
			$("#assetsSuccess").html("CHANGED ASSETS SUCCESS");
		}, function(message) {
			$("#assetsSuccess").html("FAILED: " + message);
		}]);
	});
};