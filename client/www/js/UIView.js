// THIS FILE SHOULD BE THE ONLY PLACE THE DOM IS MANIPULATED
// Handles sending new data and commands out from the DOM, and
// putting new updated data into the DOM
var UIView = function(getData, setDataListener, login, createUser, setNetworkListener) {
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
	
	var isTutorial = false;
	
	setDataListener('ready', function(isNew) {
		//if PERSIST_DATA in utility.js is set to false temp data will be set here
		if(!PERSIST_DATA) {
			setTempData();
		}
		
		$("#joyPop").hide();
		if(isNew) {
			//setup Tutorial
			isTutorial = true;
			
			pageTransitions.tutorialSetup();
			
			$("#noTutorial").click(function() {
				pageTransitions.switchPage("page-main");
				$("#menuBar").show();
				isTutorial = false;
			});
		}

		$("#budget").html("$" + getData("budget"));
		
		var val = getData("assets");
		if(val >= 0) {
			$("#prevAssets").removeClass("red");
			$("#prevAssets").html("$" + val);
		} else {
			val = val * -1;
			$("#prevAssets").addClass("red");
			$("#prevAssets").html("-$" + val);
		}
		
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
			$("#lastUpdateSpending").html("Last Update: Never Set");
		} else {
			$("#prevSpending").html("$" + track.amount);
			$("#lastUpdateSpending").html("Last Update: " + new Date(track.day));
		}
		
		//--Load Options--
		var value = getData("options");
		
		
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
		}
		
		
		if(value.notifyMorningTime !== undefined) {
			//load times
			var budgetTime = value.notifyMorningTime;
			var newDateA = new Date(budgetTime);
			$("#budgetTime").val(dateToTimeInput(newDateA));
		}
		
		if(value.notifyNightTime !== undefined) {
			var trackTime = value.notifyNightTime;
			var newDateB = new Date(trackTime);
			$("#trackTime").val(dateToTimeInput(newDateB));
		}
	});
	
	//-----------------LISTENERS----------------------
	// update budget when budget changes
	setDataListener("budget", function() {
		$("#budget").html("$" + getData("budget"));
	});
	
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
	
	setDataListener("trackedEntry", function() {
		var track = getData("trackedEntry");
		$("#prevSpending").html("$" + track.amount);
		$("#lastUpdateSpending").html("Last Update: " + new Date(track.day));
	});
	
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
	
	//make new element
	function makeTemplate(category, catName, val, updateFn, listId) {
		var uuid = guid();
		var li = document.createElement('li');
		li.id = uuid;

		var h3 = document.createElement('h3');
		h3.innerHTML = catName;
		var h32 = document.createElement('h2');
		h32.innerHTML = "$" + val;
		var deleteButton = document.createElement('button');
		deleteButton.classList.add("ui-btn", "ui-btn-inline");
		deleteButton.innerHTML = "x";
		deleteButton.style.float = "right";
		deleteButton.onclick = (function() {
			removeEntry(uuid, category, catName);
		});

		/*
		<div class="ui-flipswitch ui-shadow-inset ui-bar-inherit ui-corner-all ui-flipswitch-active">
			<a href="#" class="ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit">On</a>
			<span class="ui-flipswitch-off">Off</span>
			<select id="morningNotice" data-role="flipswitch" class="ui-flipswitch-input" tabindex="-1">
			<option value="Off">Off</option>
			<option value="On">On</option>
		</select></div>
		*/

		/*var editDiv = document.createElement('div');
		editDiv.classList.add("ui-flipswitch", "ui-shadow-inset", "ui-bar-inherit", "ui-corner-all", "ui-flipswitch-active");
		
		var editA = document.createElement('a');
		editA.classList.add("ui-flipswitch-on", "ui-btn", "ui-shadow", "ui-btn-inherit");
		editA.innerHTML = "On";

		var editSpan = document.createElement('span');
		editSpan.innerHTML = "Off";
		var editSelect = document.createElement('select');
		editSelect.setAttribute("data-role", "flipswitch");
		editSelect.classList.add("ui-flipswitch-input");
		editSelect.setAttribute("tabindex", "-1");

		var op1 = document.createElement('option');
		op1.value = "Off";
		op1.innerHTML = "Off";

		var op2 = document.createElement('option');
		op2.value = "On";
		op2.innerHTML = "On";

		editSelect.appendChild(op1);
		editSelect.appendChild(op2);

		editDiv.appendChild(editA);
		editDiv.appendChild(editSpan);
		editDiv.appendChild(editSelect);
*/
		var editButton = document.createElement("button");
		editButton.classList.add("ui-btn", "ui-btn-inline");
		editButton.innerHTML = "edit";
		editButton.onclick = (function() {
			$("#" + uuid).children('div')[0].style.display = "block";
		});

		li.appendChild(deleteButton);
		li.appendChild(h3);
		li.appendChild(h32);
		li.appendChild(editButton);
		// li.appendChild(editDiv);

		var input = document.createElement('input');
		input.class = "updateVal";
		input.type="number";
		var p = document.createElement('p');
		$("#" + uuid + " > p").on("webkitAnimationEnd", function() {
			this.className = "";
			this.textContent = "";
    	});

    	var date = document.createElement('input');
    	date.classList.add("form-control");
    	date.type = "date";

		var button = document.createElement('button');
		button.classList.add("ui-btn", "ui-btn-inline");
		button.innerHTML = "Update";
		button.onclick = (function() {
			$("#" + uuid).children('div')[0].style.display = "none";
			updateFn(uuid, catName);
		}); 

		var editField = document.createElement('div');
		editField.style.display = "none";
		editField.appendChild(input);
		editField.appendChild(button);
		li.appendChild(editField);
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
		var deleteButton = document.createElement('button');
		deleteButton.classList.add("ui-btn", "ui-btn-inline");
		deleteButton.innerHTML = "x";
		deleteButton.style.float = "right";
		deleteButton.onclick = (function() {
			removeEntry(uuid, category, catName);
		});
		var editButton = document.createElement("button");
		editButton.classList.add("ui-btn", "ui-btn-inline");
		editButton.innerHTML = "edit";
		editButton.onclick = (function() {
			$("#" + uuid).children('div')[0].style.display = "block";
		});

		li.appendChild(deleteButton);
		li.appendChild(h3);
		li.appendChild(h32);
		li.appendChild(editButton);

		var input = document.createElement('input');
		input.class = "updateVal";
		input.type="number";
		var p = document.createElement('p');
		$("#" + uuid + " > p").on("webkitAnimationEnd", function() {
			this.className = "";
			this.textContent = "";
    	});

    	var date = document.createElement('input');
    	date.classList.add("form-control");
    	date.type = "date";

		var button = document.createElement('button');
		button.classList.add("ui-btn", "ui-btn-inline");
		button.innerHTML = "Update";
		button.onclick = (function() {
			$("#" + uuid).children('div')[0].style.display = "none";
			updateFn(uuid, catName);
		}); 

		var select = document.createElement('select');
		["monthly", "weekly"].forEach(function(f) {
			var opt = document.createElement('option');
			opt.value = f;
			opt.innerHTML = f;
			select.appendChild(opt);
		});
		select.value = frequency;
		
		var editDiv = document.createElement('div');
		editDiv.style.display = "none";
		editDiv.appendChild(input);
		editDiv.appendChild(select);
		editDiv.appendChild(date);
		editDiv.appendChild(button);
		li.appendChild(editDiv);
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

	//todo: buggy b/c catName and save switches depending on addEntr
	function notifyAdd(call, category, catName, save, uuid) {
		notifyListeners(call, [category,
			save,
			//catName,
			function() {
			$("#titleText").notify("ADD " + category.toUpperCase() + " SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
			document.getElementById(uuid).getElementsByTagName('p')[0].value = "";
	       	}, function(message) {
				document.getElementById(uuid).remove();
				$("#titleText").notify("FAILURE: " + message, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
			}]);
	}

	//used for changeEntry
	function notifyChange(call, category, catName, save, uuid) {
		notifyListeners(call, [category,
			catName,
			save,
			function() {
			$("#titleText").notify("UPDATE " + category.toUpperCase() + " SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
		}, function(message) {
			$("#titleText").notify("FAILURE: " + message, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
		}]);

		document.getElementById(uuid).getElementsByTagName('p')[0].value = "";
	}

	function notifyTrackSpend(tracked, spendType) {
		notifyListeners("trackSpending", [tracked, spendType, function() {
			$("#buttonTrack").notify("TRACK SPENDING SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false, gap:15});
		}, function(message) {
			$("#buttonTrack").notify("FAILURE: " + message, {position:"bottom center", autoHideDelay:1500, arrowShow:false, gap:15});
		}]);
	}


	//--------------------------------------
	// 			Login
	//--------------------------------------
	$("#login").click(function() {
		var un = $("#username").val();
		var pw = $("#password").val();

		login(un, pw, 
		function() {
			$("#titleText").notify("LOGIN SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
			document.getElementById("username").value = "";
			document.getElementById("password").value = "";
			pageTransitions.switchPage("page-main");
	    },
		function(response) {
			console.log("me")
			var json = JSON.parse(response.responseJSON)
			console.log(json)
			if(json.status == 422 || json.status == 401 || json.status == 500) {
				$("#titleText").notify(json.message, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
			} else {
				$("#titleText").notify("ERROR", {position:"bottom center", autoHideDelay:1500, arrowShow:false});
			}
		});
		
		if(isTutorial) {
			$("#page-login-tutorial").html("NEXT");
		}
	});

	$("#password").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#login").click();
		}
	});

	$("#addUser").click(function() {
		var name = $("#newName").val();
		var un = $("#newUsername").val();
		var pw = $("#newPassword").val();
		var pwv = $("#newPasswordVerify").val();

		if(pw == pwv) {
			console.log("passwords verified");
			//how to add user?
			createUser(un, pw, name, 
			function() {
				$("#titleText").notify("CREATE USER SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
			},
			function(response) {
				var json = JSON.parse(response.responseJSON)
				if(json.status == 422 || json.status == 401 || json.status == 500) {
				$("#titleText").notify(json.message, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
				} else {
					$("#titleText").notify("ERROR", {position:"bottom center", autoHideDelay:1500, arrowShow:false});
				}
			}); 
		}
		
		if(isTutorial) {
			$("#page-login-tutorial").html("NEXT");
		}
	});

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
		notifyAdd("addEntry", "savings", catName, save, uuid);
		if(isTutorial) {
			$("#page-savings-tutorial").html("NEXT");
		}
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
		notifyChange("changeEntry", "savings", catName, save, uuid);
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
		notifyAdd("addEntry", "charges", catName, save, uuid);
		if(isTutorial) {
			$("#page-charges-tutorial").html("NEXT");
		}
	});

	function updateChargesEntry(uuid, catName) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		var select = li.getElementsByTagName('select')[0];
		var frequency = select.options[select.selectedIndex].value;
		var startDate = li.getElementsByTagName('input')[1].value;

		if(val === "") {
			val = li.getElementsByTagName('h2')[0].innerHTML.split("$")[1];
		}

		li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
		li.getElementsByTagName('input')[0].value = "";

		var save = new ChargeEntry(catName, val, frequency, dateInputToDate(startDate), false);

		notifyChange("changeEntry", "charges", catName, save, uuid);
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
		notifyAdd("addEntry", "income", catName, save, uuid);
		if(isTutorial) {
			$("#page-income-tutorial").html("NEXT");
		}
	});
	
	function updateIncomeEntry(uuid, catName) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		var select = li.getElementsByTagName('select')[0];
		var frequency = select.options[select.selectedIndex].value;
		var startDate = li.getElementsByTagName('input')[1].value;

		if(val === "") {
			val = li.getElementsByTagName('h2')[0].innerHTML.split("$")[1];
		
		}
		li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
		li.getElementsByTagName('input')[0].value = "";
		
		var save = new IncomeEntry(catName, val, frequency, dateInputToDate(startDate), 0, true);
		notifyChange("changeEntry", "income", catName, save, uuid);
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
		   $("#buttonAssets").notify("CHANGED ASSETS SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false, gap:15});
			if(isTutorial) {
				$("#page-assets-tutorial").show();
			}
		}, function(message) {
			$("#buttonAssets").notify('FAILED: ' + message, {position:"bottom center", autoHideDelay:1500, arrowShow:false, gap:15});
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
	
	//get selected radio button
	$("#submitOverUnder").click(function() {
		var spendType = $("input[name='ou']:checked").val();
		notifyTrackSpend(tracked, spendType);
	});

	//--------------------------------------
	// 			Options
	//--------------------------------------
	
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
	
	
	//for testing?
	$("#resetStorage").click(function() {
		clearStorage();
		$("#resetNote").html("Storage cleared. Reload/reopen app to see default state.");
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