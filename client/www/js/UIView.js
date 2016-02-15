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
	
	$(document).ready(function() {
		//if PERSIST_DATA in utility.js is set to false temp data will be set here
		setTempData();
		
		var arr = getData("savings");
		arr.forEach(function(ctx) {
			$("#savingsList").append('<li id ="'+ ctx.name + '"><h3>' + ctx.name + '</h3><h3 id="prev' + ctx.name + '">$' + ctx.amount +'</h3><input id="text' + ctx.name + '" data-controller="input-value" type="number" min = "0"><button id="button' + ctx.name + '">Update</button><p id="save' + ctx.name +'"></p></li>');
			
			$("#button" + ctx.name).click(function() { changeSavingEntry(ctx.name, ctx.isDefault); });
		});
	});
	
	//-----------------LISTENERS----------------------
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
		var arr = getData("savings");
		arr.forEach(function(ctx) {
			$("#prev" + ctx.name).html("$" + ctx.amount);
		});
	});
	
	//-----------------BUTTONS--------------------------
	$("#addSavings").on("singletap", function() {
        $.UIPopup({
          id: "addEntrySavings",
          title: 'Input Entry Name', 
          cancelButton: 'CANCEL', 
          continueButton: 'OK', 
          callback: function() {
            var popupMessageTarget = document.querySelector('#popupMessageTarget');
            popupMessageTarget.textContent = 'Entry added.';
            popupMessageTarget.classList.remove("animatePopupMessage");
            popupMessageTarget.classList.add("animatePopupMessage");
          }
        });
      });
	
	$("#buttonAssets").click(function() {
		notifyListeners("updateAssets", [parseInt($("#setAssets").val()), function() {
			document.querySelector('#assetsSuccess');
            assetsSuccess.textContent = 'CHANGED ASSETS SUCCESS';
            assetsSuccess.classList.remove("animatePopupMessage");
            assetsSuccess.classList.add("animatePopupMessage");
		}, function(message) {
			document.querySelector('#assetsSuccess');
            assetsSuccess.textContent = 'FAILED: ' + message;
            assetsSuccess.classList.remove("animatePopupMessage");
            assetsSuccess.classList.add("animatePopupMessage");
		}]);
	});
	
	//attached to buttons defined in .ready()
	function changeSavingEntry(name, isDefault) {
		var save = new SavingsEntry(name, parseInt($("#text" + name).val()), isDefault);
		notifyListeners("changeEntry", ["savings", name, save, function() {
			$("#save" + name).html("CHANGED SAVINGS SUCCESS");
		}, function(message) {
			$("#save" + name).html("FAILED: " + message);
		}]);
	}
	
	//----------------------------------------------//
	// This is just an animation for popup callback, 
    // Not part of popup functionality.
    $("#popupMessageTarget").on("webkitAnimationEnd", function() {
		this.className = "";
		this.textContent = "";
    });
	
	$("#assetsSuccess").on("webkitAnimationEnd", function() {
		this.className = "";
		this.textContent = "";
    });
	//----------------------------------------------//
};