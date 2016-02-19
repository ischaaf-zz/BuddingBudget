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
	
	setDataListener('ready', function() {
		//if PERSIST_DATA in utility.js is set to false temp data will be set here
		if(!PERSIST_DATA) {
			setTempData();
		}

		$("#budget").html("$" + getData("budget"));
		$("#prevAssets").html("$" + getData("assets"));
		
		var arr = getData("savings");
		arr.forEach(function(ctx) {
			//Todo: replace with makeTemplate based on object
			makeTemplate("savings", ctx.name, ctx.amount, updateSavingsEntry, "#savingsList")
		});

		var arr = getData("charges");
		arr.forEach(function(ctx) {
			makeRecurringTemplate("charges", ctx.name, ctx.amount, ctx.period, updateChargesEntry, "#chargesList");
		});
		
		var arr = getData("income");
		arr.forEach(function(ctx) {
			makeRecurringTemplate("income", ctx.name, ctx.amount, ctx.period,
				updateIncomeEntry, "#incomeList");
		});

		var arr = getData("options");
		//TODO: replace with saved options
		$("#trackTime").datebox('disable');
		$("#budgetTime").datebox('disable');
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

		if(catName == null || catName == "") {
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
		if(val == "") {
			return;
		}

		li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
		li.getElementsByTagName('input')[0].value = "";
		
		var save = new SavingsEntry(catName, parseInt(val), false);
		notify2("changeEntry", "savings", catName, save, uuid);
	}

	//--------------------------------------
	// 			Charge
	//--------------------------------------
	$("#addCharge").click(function() {
		var catName = document.getElementById("newChargeName").value;
		document.getElementById("newChargeName").value = "";
		if(catName == null || catName == "") {
			return;
		}

		var uuid = makeRecurringTemplate("charges", catName, 0, "monthly", updateChargesEntry, "#chargesList");
		
		//generalize this? SavingsEntry
		//add element to "savings" array
		var save = new ChargeEntry(catName, 0, 'monthly', 5, true);
		notify("addEntry", "charges", catName, save, uuid);
	});

	function updateChargesEntry(uuid, catName) {
		var li = document.getElementById(uuid);
		var val = li.getElementsByTagName('input')[0].value;
		var select = li.getElementsByTagName('select')[0];
		var frequency = select.options[select.selectedIndex].value;
		
		if(val == "") {
			val = li.getElementsByTagName('h2')[0].innerHTML.split("$")[1];
		}

		li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
		li.getElementsByTagName('input')[0].value = "";
		//What does isDefault do?! Set to false here
		var save = new ChargeEntry(catName, val, frequency, 5, false);
		notify2("changeEntry", "charges", catName, save, uuid);
	}
	
	//--------------------------------------
	// 			Income
	//--------------------------------------
	$("#addIncome").click(function() {
		var catName = document.getElementById("newIncomeName").value;
		document.getElementById("newIncomeName").value = "";
		if(catName == null || catName == "") {
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
		if(val == "") {
			val = li.getElementsByTagName('h2')[0].innerHTML.split("$")[1];
		
		}
			li.getElementsByTagName('h2')[0].innerHTML = "$" +  val;
			li.getElementsByTagName('input')[0].value = "";
		
		//What does isDefault do?! Set to false here
		var save = new IncomeEntry(catName, val, frequency, 1, 5, true);
		notify2("changeEntry", "income", catName, save, uuid);
	}

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
	// 			Options
	//--------------------------------------
	$("#habitTrack").change(function() {
		var label = $("#habitTrack").prop("checked") ? "On" : "Off";
		//selection not yet defined in UIController
		//TODO: Rewrite when defined
		notifyListeners("options", ["budgetNotify", label, function() {
			//success
		}, function(message) {
			//failure
		}]);
	});
	
	$("#assetNotice").change(function() {
		var label = $("#assetNotice").prop("checked") ? "On" : "Off";
		//selection not yet defined in UIController
		//TODO: Rewrite when defined
		notifyListeners("options", ["assetNotice", label, function() {
			//success
		}, function(message) {
			//failure
		}]);
	});
	
	$("#nightNotice").change(function() {
		var label = $("#nightNotice").prop("checked") ? "On" : "Off";
		if(label == 'On') {
			$("#trackTime").datebox('enable');
		} else {
			$("#trackTime").datebox('disable');
		}
		
		//selection not yet defined in UIController
		//TODO: Rewrite when defined
		notifyListeners("options", ["nightNotice", label, function() {
			//success
		}, function(message) {
			//failure
		}]);
	});
	
	$("#morningNotice").change(function() {
		var label = $("#morningNotice").prop("checked") ? "On" : "Off";
		if(label == 'On') {
			$("#budgetTime").datebox('enable');
		} else {
			$("#budgetTime").datebox('disable');
		}
		
		//selection not yet defined in UIController
		//TODO: Rewrite when defined
		notifyListeners("options", ["morningNotice", label, function() {
			//success
		}, function(message) {
			//failure
		}]);
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