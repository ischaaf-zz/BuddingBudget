// THIS FILE SHOULD BE THE ONLY PLACE THE DOM IS MANIPULATED
// Handles sending new data and commands out from the DOM, and
// putting new updated data into the DOM.
var UIView = function(getData, setDataListener, login, setNetworkListener) {

	// events: updateAssets, trackSpending, setOption, 
	//		   addEntry, changeEntry, removeEntry
	var callbacks = {};

	var pageTransitions = new PageTransitions();

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
	
	setDataListener('ready', function(isNew) {
		//if PERSIST_DATA in utility.js is set to false temp data will be set here
		if(!PERSIST_DATA) {
			setTempData();
		}

		$("#budget").html("$" + getData("budget"));
		$("#prevAssets").html("$" + getData("assets"));
		
		//load savings
		var arr = getData("savings");
		arr.forEach(function(ctx) {
			//Todo: replace with makeTemplate based on object
			makeTemplate("savings", ctx.name, ctx.amount, updateSavingsEntry, "#savingsList");
		});

		//load recurring charges
		arr = getData("charges");
		arr.forEach(function(ctx) {
			makeRecurringTemplate("charges", ctx.name, ctx.amount, ctx.period, updateChargesEntry, "#chargesList");
		});
		
		//load recurring income
		arr = getData("income");
		arr.forEach(function(ctx) {
			makeRecurringTemplate("income", ctx.name, ctx.amount, ctx.period,
				updateIncomeEntry, "#incomeList");
		});
		
		//load track spending
		var track = getData("trackedEntry");
		if(typeof track.amount === "undefined" || track.amount === null) {
			$("#prevSpending").html("$0");
		} else {
			$("#prevSpending").html("$" + track.amount);
			$("#lastUpdateSpending").html("Last Update: " + new Date(track.day));
		}
		
		//--Load Options--
		
		//---BUGGY---
		//load flip switch options
		var value = getData("options");
		console.log("-----------");
		console.log(value);
		
		if(value.isNotifyMorning == 'On') {
			$("#morningNotice").val("On").flipswitch("refresh");
			$("#budgetTime").datebox('enable');
		} else {
			$("#budgetTime").datebox('disable');
		}
		
		if(value.isNotifyNight == 'On') {
			$("#nightNotice").val("On").flipswitch("refresh");
			$("#trackTime").datebox('enable');
		} else {
			$("#trackTime").datebox('disable');
		}
		
		if(value.isNotifyAssets == 'On') {
			$("#assetNotice").val("On").flipswitch("refresh");
			$("#selectAssetNotice").selectmenu('enable');
		} else {
			$("#selectAssetNotice").selectmenu('disable');
		}
		
		//load asset update reminder period
		if(value.notifyAssetsPeriod !== undefined) {
			$("#selectAssetNotice option[value='" + value.notifyAssetsPeriod + "']").attr("selected", "selected");
			$("#selectAssetNotice").selectmenu('refresh', true);
		}
		
		if(PERSIST_DATA) {
			//load end date
			var theDate = getData("endDate");
			var newDate = new Date(theDate);
			$("#endDate").val(dateToDateInput(newDate));
			// $("#endDate").datebox('setTheDate', newDate).trigger('datebox', {'method':'doset'});
		}
		
		if(value.notifyMorningTime !== undefined) {
			//load times
			var budgetTime = value.notifyMorningTime;
			var newDateA = new Date(budgetTime);
			$("#budgetTime").datebox('setTheDate', newDateA).trigger('datebox', {'method':'doset'});
		}
		
		if(value.notifyNightTime !== undefined) {
			var trackTime = value.notifyNightTime;
			var newDateB = new Date(trackTime);
			$("#trackTime").datebox('setTheDate', newDateB).trigger('datebox', {'method':'doset'});
		}
		
		//load min daily budget
		if(value.minDailyBudget !== undefined) {
			$("#minBudget").html("$" + value.minDailyBudget);
		} else {
			$("#minBudget").html("");
		}
	});
	
	//-----------------LISTENERS----------------------
	// update budget when budget changes
	setDataListener("budget", function() {
		$("#budget").html("$" + getData("budget"));
	});
	
	setDataListener("assets", function() {
		$("#prevAssets").html("$" + getData("assets"));
	});
	
	setDataListener("trackedEntry", function() {
		var track = getData("trackedEntry");
		$("#prevSpending").html("$" + track.amount);
		$("#lastUpdateSpending").html("Last Update: " + new Date(track.day));
	});
	
	// setup savings and update when there are changes
	// warning: currently dependant on SavingsEntry internals
	// setDataListener("savings", function() {
	// 	var arr = getData("savings");
	// 	arr.forEach(function(ctx) {
	// 		$("#prev" + ctx.name).html("$" + ctx.amount);
	// 	});
	// });

	// setDataListener("charges", function() {
	// 	var arr = getData("charges");
	// 	arr.forEach(function(ctx) {
	// 		$("#prevCh" + ctx.name).html("$" + ctx.amount);
	// 	});
	// });
	
	setDataListener("options", function() {
		var value = getData("options");
		
		$("#minBudget").html("$" + value.minDailyBudget);
		//console.log(value);
		
		if(value.isNotifyMorning == 'On') {
			$("#budgetTime").datebox('enable');
		} else {
			$("#budgetTime").datebox('disable');
		}
		
		if(value.isNotifyNight == 'On') {
			$("#trackTime").datebox('enable');
		} else {
			$("#trackTime").datebox('disable');
		}
		
		if(value.isNotifyAssets == 'On') {
			$("#selectAssetNotice").selectmenu('enable');
		} else {
			$("#selectAssetNotice").selectmenu('disable');
		}
	});
	
	//make new element
	function makeTemplate(category, catName, val, updateFn, listId) {
		var uuid = guid();
		var li = document.createElement('li');
		li.id = uuid;
		var h3 = document.createElement('h3');
		h3.innerHTML = catName;
		var h32 = document.createElement('h2');
		h32.innerHTML = "$" + val;
		var input = document.createElement('input');
		input.class = "updateVal";
		input.type="number";
		var p = document.createElement('p');
		p.classList.add("attentionGrapper");
		$("#" + uuid + " > p").on("webkitAnimationEnd", function() {
			this.className = "";
			this.textContent = "";
    	});
		var button = document.createElement('button');
		button.classList.add("ui-btn", "ui-btn-inline");
		button.innerHTML = "Update";
		button.onclick = (function() {
			updateFn(uuid, catName);
		}); 

		var deleteButton = document.createElement('button');
		deleteButton.classList.add("ui-btn", "ui-btn-inline");
		deleteButton.innerHTML = "x";
		deleteButton.onclick = (function() {
			removeEntry(uuid, category, catName);
		});

		li.appendChild(h3);
		li.appendChild(h32);
		li.appendChild(input);
		li.appendChild(button);
		li.appendChild(deleteButton);
		li.appendChild(p);
		$(listId).append(li);

		return uuid;
	}

	function makeRecurringTemplate(category, catName, val, frequency, updateFn, listId) {
		var uuid = guid();
		var li = document.createElement('li');
		li.id = uuid;
		var h3 = document.createElement('h3');
		h3.innerHTML = catName;
		var h32 = document.createElement('h2');
		h32.innerHTML = "$" + val;
		var input = document.createElement('input');
		input.class = "updateVal";
		input.type="number";
		var p = document.createElement('p');
		p.classList.add("attentionGrapper");
		$("#" + uuid + " > p").on("webkitAnimationEnd", function() {
			this.className = "";
			this.textContent = "";
    	});

		var button = document.createElement('button');
		button.classList.add("ui-btn", "ui-btn-inline");
		button.innerHTML = "Update";
		button.onclick = (function() {
			updateFn(uuid, catName);
		}); 

		var deleteButton = document.createElement('button');
		deleteButton.classList.add("ui-btn", "ui-btn-inline");
		deleteButton.innerHTML = "x";
		deleteButton.style.float = "right";
		deleteButton.onclick = (function() {
			removeEntry(uuid, category, catName);
		});

		li.appendChild(deleteButton);
		li.appendChild(h3);
		li.appendChild(h32);
		li.appendChild(input);

		var select = document.createElement('select');
		//TODO add options dynamically?
		["monthly", "weekly", "biweekly", "twiceMonthly"].forEach(function(f) {
			var opt = document.createElement('option');
			opt.value = f;
			opt.innerHTML = f;
			select.appendChild(opt);
		});
		select.value = frequency;
		li.appendChild(select);
		li.appendChild(button);
		li.appendChild(p);
		$(listId).append(li);

		return uuid;
	}

	function removeEntry(uuid, category, catName) {
		notifyListeners("removeEntry", [category,
			catName,
			function() {
				document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "REMOVE " + category.toUpperCase() + " SUCCESS";
			}, 
			function(message) {
				document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "FAILED: " + message;
		}]);
		document.getElementById(uuid).remove();
	}

	//todo: buggy b/c catName and save switches depending on addEntry or changeEntry call?
	function notify(call, category, catName, save, uuid) {
		notifyListeners(call, [category,
			save,
			catName,
			function() {
			var p = document.getElementById(uuid).getElementsByTagName('p')[0];
            p.html = 'CHANGED ' + category.toUpperCase() + ' SUCCESS';
            p.classList.remove("animatePopupMessage");          
            p.classList.add("animatePopupMessage");
       	}, function(message) {
			var p = document.getElementById(uuid).getElementsByTagName('p')[0];
            p.html = 'FAILED: ' + message;
            p.classList.remove("animatePopupMessage");          
            p.classList.add("animatePopupMessage");
		}]);
		document.getElementById(uuid).getElementsByTagName('p')[0].value = "";
            
		// 	function() {
		// 	document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "CHANGED " + category.toUpperCase() + " SUCCESS";
		// 	}, 
		// 	function(message) {
		// 	document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "FAILED: " + message;
		// }]);
	}

	//workaround for weird save/catName switch
	function notify2(call, category, catName, save, uuid) {
		notifyListeners(call, [category,
			catName,
			save,
			function() {
			var p = document.getElementById(uuid).getElementsByTagName('p')[0];
            p.textContent = 'CHANGED ' + category.toUpperCase() + ' SUCCESS';
            p.classList.remove("animatePopupMessage");          
            p.classList.add("animatePopupMessage");
		}, function(message) {
			var p = document.getElementById(uuid).getElementsByTagName('p')[0];
            p.textContent = 'FAILED: ' + message;
            p.classList.remove("animatePopupMessage");          
            p.classList.add("animatePopupMessage");
		}]);

		document.getElementById(uuid).getElementsByTagName('p')[0].value = "";
        
		/*notifyListeners(call, [category,
			catName,
			save,
			function() {
			document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "CHANGED " + category.toUpperCase() + " SUCCESS";
			}, 
			function(message) {
			document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "FAILED: " + message;
		}]);*/
	}

	//--------------------------------------
	// 			Savings
	//--------------------------------------
	$("#addSavings").click(function() {
		var catName = document.getElementById("newSavingsName").value;

		document.getElementById("newSavingsName").value = "";

		if(catName === null || catName === "") {
			return;
		}

		var uuid = makeTemplate("savings", catName, 0, updateSavingsEntry, "#savingsList");

		//generalize this? SavingsEntry
		//add element to "savings" array
		var save = new SavingsEntry(catName, 0, true);
		notify("addEntry", "savings", catName, save, uuid);

		
	});

	function updateSavingsEntry(uuid, catName) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		if(val === "") {
			return;
		}

		li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
		li.getElementsByTagName('input')[0].value = "";
		
		var save = new SavingsEntry(catName, parseInt(val), false);
		notify2("changeEntry", "savings", catName, save, uuid);
	}
	
	//todo: does not work?
	$("#savingsPopup").click(function() {
		$("#newSavingsName").focus();
	});

	$("#newSavingsName").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#addSavings").click();
		}
	});

	/* --No longer called anywhere--?
	//attached to buttons defined in .ready()
	function changeSavingEntry(name, isDefault) {
		var save = new SavingsEntry(name, parseInt($("#text" + name).val()), isDefault);
		notifyListeners("changeEntry", ["savings", name, save, function() {
			$("#save" + name).html("CHANGED SAVINGS SUCCESS");
		}, function(message) {
			$("#save" + name).html("FAILED: " + message);
		}]);
	}
	*/

	//--------------------------------------
	// 			Charge
	//--------------------------------------
	$("#addCharge").click(function() {
		var catName = document.getElementById("newChargeName").value;
		document.getElementById("newChargeName").value = "";
		if(catName === null || catName === "") {
			return;
		}

		var uuid = makeRecurringTemplate("charges", catName, 0, "monthly", updateChargesEntry, "#chargesList");
		
		//generalize this? SavingsEntry
		//add element to "savings" array
		var save = new ChargeEntry(catName, 0, 'monthly', 1, true);
		notify("addEntry", "charges", catName, save, uuid);
	});

	function updateChargesEntry(uuid, catName) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		var select = li.getElementsByTagName('select')[0];
		var frequency = select.options[select.selectedIndex].value;
		
		if(val === "") {
			val = li.getElementsByTagName('h2')[0].innerHTML.split("$")[1];
		}

		li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
		li.getElementsByTagName('input')[0].value = "";
		//What does isDefault do?! Set to false here
		var save = new ChargeEntry(catName, val, frequency, 1, false);
		notify2("changeEntry", "charges", catName, save, uuid);
	}

	$("#newChargeName").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#addCharge").click();
		}
	});

	//--------------------------------------
	// 			Income
	//--------------------------------------
	$("#addIncome").click(function() {
		var catName = document.getElementById("newIncomeName").value;
		document.getElementById("newIncomeName").value = "";
		if(catName === null || catName === "") {
			return;
		}

		var uuid = makeRecurringTemplate("income", catName, 0, "monthly", updateIncomeEntry, "#incomeList");

		//generalize this? SavingsEntry
		//add element to "savings" array
		var save = new IncomeEntry(catName, 0, "monthly", 1, 5, true);
		notify("addEntry", "income", catName, save, uuid);
	});
	
	function updateIncomeEntry(uuid, catName) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		var select = li.getElementsByTagName('select')[0];
		var frequency = select.options[select.selectedIndex].value;
		if(val === "") {
			val = li.getElementsByTagName('h2')[0].innerHTML.split("$")[1];
		
		}
			li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
			li.getElementsByTagName('input')[0].value = "";
		
		//What does isDefault do?! Set to false here
		var save = new IncomeEntry(catName, val, frequency, 1, 5, true);
		notify2("changeEntry", "income", catName, save, uuid);
	}


	$("#newIncomeName").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#addIncome").click();
		}
	});

	//--------------------------------------
	// 			Assets
	//--------------------------------------
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
		document.getElementById("setAssets").value = "";
	});
	
	//--------------------------------------
	// 			Track Spending
	//--------------------------------------
	var tracked;
	$("#buttonTrack").click(function() {
		var amount = parseInt($("#setTrack").val());
		var budget = getData("budget");
		var day = (new Date()).getTime();
		tracked = new TrackEntry(amount, budget, day);
		
		var spendType = "distribute";
		
		//check if over/under spent
		var overUnder = budget - amount;
		if(overUnder > 0 || overUnder < 0) {
			$("#overUnderPopup").popup("open");
		} else {
			notifyTrackSpend(tracked, spendType);
		}
		
		document.getElementById("setTrack").value = "";
	});
	
	function notifyTrackSpend(tracked, spendType) {
		notifyListeners("trackSpending", [tracked, spendType, function() {
			document.querySelector('#trackSuccess');
            trackSuccess.textContent = 'TRACK SPENDING SUCCESS';
            trackSuccess.classList.remove("animatePopupMessage");
            trackSuccess.classList.add("animatePopupMessage");
		}, function(message) {
			document.querySelector('#trackSuccess');
            trackSuccess.textContent = 'FAILED: ' + message;
            trackSuccess.classList.remove("animatePopupMessage");
            trackSuccess.classList.add("animatePopupMessage");
		}]);
	}
	
	//get selected radio button
	$("#submitOverUnder").click(function() {
		var spendType = $("input[name='ou']:checked").val();
		notifyTrackSpend(tracked, spendType);
	});

	//--------------------------------------
	// 			Options
	//--------------------------------------
	/* no longer in use
	$("#habitTrack").change(function() {
		var label = $("#habitTrack").prop("checked") ? "On" : "Off";
		notifyListeners("setOption", ["isEnableTracking", label, function() {
			//success
		}, function(message) {
			//failure
		}]);
	}); */
	
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
			console.log("SUCCESS: " + $("#endDate").val());
		}, function(message) {
			console.log("FAILURE: " + message);
		}]);
	});
	
	//callback for dateboxes
	window.budgetNotify = function(date, initDate, duration, custom, cancelClose) {
		notifyListeners("setOption", ["notifyMorningTime", date.date.getTime(), function() {
			//success
		}, function(message) {
			//failure
		}]);
	};
	
	window.trackNotify = function(date, initDate, duration, custom, cancelClose) {
		notifyListeners("setOption", ["notifyNightTime", date.date.getTime(), function() {
			//success
		}, function(message) {
			//failure
		}]);
	};
	
	
	//for testing?
	$("#resetStorage").click(function() {
		clearStorage();
		$("#resetNote").html("Storage cleared. Reload/reopen app to see default state.");
	});
	
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
	
	$("#trackSuccess").on("webkitAnimationEnd", function() {
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
};