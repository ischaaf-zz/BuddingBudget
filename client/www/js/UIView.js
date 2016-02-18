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
			appendSavingsList(ctx);
		});

		var arr = getData("charges");
		arr.forEach(function(ctx) {
			$("#chargesList").append('<div><li id =ch"'+ ctx.name + '"><h3>' + "ch" + ctx.name + '</h3><h3 id="prevCh' + ctx.name + '">$' + ctx.amount +'</h3><input id="chargeInput' + ctx.name + '" data-controller="input-value" type="number" min = "0"><button class="ui-btn ui-btn-inline" id="buttonCh' + ctx.name + '">Update</button><p id="charge' + ctx.name +'"></p></li></div>');
			
			$("#chargesList #buttonCh" + ctx.name).click(function() { changeChargeEntry(ctx.name, ctx.isDefault); });
		});
	});
	
	// //delete items from savings list
	// $(function() {
	// 	$("#savingsList").UIEditList({
	// 		editLabel: "DELETE ENTRY",
	// 		movable: false,
	// 		deletable: true,
	// 		callback: function(list) {
	// 			//TODO:callback
	// 		}
	// 	});
 //    });
	
	//append to savings entry list
	function appendSavingsList(ctx) {
		$("#savingsList").append('<div><li id ="'+ ctx.name + '"><h3>' + ctx.name + '</h3><h3 id="prev' + ctx.name + '">$' + ctx.amount +'</h3><input id="text' + ctx.name + '" data-controller="input-value" type="number" min = "0"><button class="ui-btn ui-btn-inline" id="button' + ctx.name + '" >Update</button><p id="save' + ctx.name +'"></p></li></div>');
			
		$("#button" + ctx.name).click(function() { changeSavingEntry(ctx.name, ctx.isDefault); });
	}
	
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

	setDataListener("charges", function() {
		var arr = getData("charges");
		arr.forEach(function(ctx) {
			$("#prevCh" + ctx.name).html("$" + ctx.amount);
		});
	});
	
	//-----------------BUTTONS--------------------------
	
	/*//hide savings edit buttons on return to main page
	$("#saveNext").click(function() {
		$('#savingsList').removeClass('showIndicators');
        $('button.done').addClass('edit').removeClass('done').text('Edit');
		//$('button.delete').hide();
	});*/
	
	//add new savings entry - popup with textbox to ask for entry name
	$("#addSavings").click(function() {
		//Todo: generalize this to makeTemplate(params)
		var uuid = guid();
		var li = document.createElement('li');
		li.id = uuid;

		var h3 = document.createElement('h3');
		h3.innerHTML = "unnamed";
		var h32 = document.createElement('h2');
		h32.innerHTML = "$0"
		var input = document.createElement('input');
		input.class = "updateVal";
		input.type="number";
		var p = document.createElement('p');

		var button = document.createElement('button');
		button.classList.add("ui-btn", "ui-btn-inline");
		button.innerHTML = "Update";
		button.onclick = (function() {
			updateSavingsEntry(uuid);
		}); 

		li.appendChild(h3);
		li.appendChild(h32);
		li.appendChild(input);
		li.appendChild(button);
		li.appendChild(p);
		$("#savingsList").append(li);

		//generalize this? SavingsEntry
		//add element to "savings" array
		var save = new SavingsEntry(uuid, 0, true);
		notifyListeners("addEntry", ["savings",
			save,
			uuid,
			function() {
				document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "ADD SAVINGS SUCCESS";
			}, 
			function(message) {
				document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "FAILED: " + message;
		}]);
		console.log(getData("savings"));
	});

	function updateSavingsEntry(uuid) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
		
		//What does isDefault do?! Set to false here
		var save = new SavingsEntry(uuid, val, false);
		notifyListeners("changeEntry", ["savings",
			uuid,
			save,
			function() {
			document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "CHANGED SAVINGS SUCCESS";
			}, 
			function(message) {
			document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "FAILED: " + message;
		}]);
		//Todo: add uuid as name and val to entry
	}
		//hide delete
		//$('#savingsList').removeClass('showIndicators');
        //$('button.done').addClass('edit').removeClass('done').text('Edit');
		//$('button.delete').hide();
		
        /*$.UIPopup({
			id: "addEntrySavings",
			title: 'Input Entry Name', 
			cancelButton: 'CANCEL', 
			continueButton: 'OK', 
			message: '<input id="entryBox" data-controller="input-value">',
			callback: function() {
				//BUGGY: THIS LINE IS CURRENTLY RETURNING UNDEFINED for #entryBox
				var temp = new SavingsEntry($("#entryBox").text(), 0, false);
				
				notifyListeners("addEntry", ["savings", temp, function() {
					var popupMessageTarget = document.querySelector('#popupMessageTarget');
					popupMessageTarget.textContent = 'Entry added.';
					popupMessageTarget.classList.remove("animatePopupMessage");
					popupMessageTarget.classList.add("animatePopupMessage");
					
					appendSavingsList(temp);
				}, function(message) {
					var popupMessageTarget = document.querySelector('#popupMessageTarget');
					popupMessageTarget.textContent = 'Entry add FAILED.' + temp.name;
					popupMessageTarget.classList.remove("animatePopupMessage");
					popupMessageTarget.classList.add("animatePopupMessage");
				}]);
			}
		});
    });*/

	$("#addCharge").click(function() {
		var lastLi =  $("#chargesList")[$("#chargesList").length -1];
		$("#chargesList").append('<div><li><h3>Rent</h3><h3>$500</h3><input data-controller="input-value" type="number" min="0"><button class="ui-btn ui-btn-inline">Update</button></li><div>');
	});
	
	//update assets
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

	function changeChargeEntry(name, isDefault) {
		var save = new ChargeEntry(name, parseInt($("#chargeInput" + name).val()), 1, new Date().toLocaleString(), isDefault);
		notifyListeners("changeEntry", ["charges", name, save, function() {
			$("#charge" + name).html("CHANGED CHARGES SUCCESS");
		}, function(message) {
			$("#charge" + name).html("FAILED: " + message);
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

	//generates random uuid for html elements
	function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	}

	// A mapping of each page to the user-facing
	// name of the page
	var pages = {
		"page-main" : "Daily Budget",
		"page-assets" : "Assets",
		"page-savings" : "Savings",
		"page-charges" : "Recurring Charges",
		"page-income" : "Recurring Income",
		"page-tracking" : "Track Spending",
		"page-options" : "Options"
	};

	// The page currently being displayed
	var activePage;

	// Set the onclick for a pageID's button to fade to
	// the given page.
	function setUpPageSwitch(pageID) {
		var pageIDs = Object.keys(pages);
		$("#" + pageID + "-button").click(function() {
			if(activePage !== pageID) {
				$("#" + activePage).fadeOut("fast", function() {
					$("#titleText").text(pages[pageID]);
					$("#" + pageID).fadeIn("fast");
				});
				activePage = pageID;
			}
		});
	}

	// Set up page switches, and set starting page
	// to the main budget page
    function initialSetup() {
    	var pageIDs = Object.keys(pages);
    	for(var i = 0; i < pageIDs.length; i++) {
    		setUpPageSwitch(pageIDs[i]);
    		$("#" + pageIDs[i]).hide()
    	}
    	$("#page-main").show();
    	$("#titleText").text(pages["page-main"]);
    	activePage = "page-main";
    }

	initialSetup();

};