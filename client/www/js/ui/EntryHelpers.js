function EntryHelpers(notifyListeners) {

	//--------------------------------------
	// 	Dynamically create elements (savings, charges, income)
	//--------------------------------------

	var self = this;
	
	//hide entry editing on menu click
	$("#leftpanel div ul li a").click(function() {
		console.log("hey");
		var listSave = $("#savingsList").find('li');
		listSave.each(function(index) {
			var currentEntry = listSave[index];
			var id = currentEntry.id;
			$("#" + id).children('div')[0].style.display = "none";
			$("#" + id).children('button')[1].style.display = "block";
		});
		
		var listCharges = $("#chargesList").find('li');
		listCharges.each(function(index) {
			var currentEntry = listCharges[index];
			var id = currentEntry.id;
			$("#" + id).children('div')[0].style.display = "none";
			$("#" + id).children('button')[1].style.display = "block";
		});
		
		var listIncome = $("#incomeList").find('li');
		listIncome.each(function(index) {
			var currentEntry = listIncome[index];
			var id = currentEntry.id;
			$("#" + id).children('div')[0].style.display = "none";
			$("#" + id).children('button')[1].style.display = "block";
		});
	});
	
	//make new element
	this.makeTemplate = function(category, catName, val, updateFn, listId) {
		var uuid = guid();
		var entry = document.createElement('li');
		entry.id = uuid;

		var h3 = document.createElement('h3');
		h3.innerHTML = catName;
		var h32 = document.createElement('h2');
		h32.innerHTML = "$" + val;
		var deleteButton = document.createElement('button');
		deleteButton.classList.add("ui-btn", "ui-btn-inline");
		deleteButton.innerHTML = "x";
		deleteButton.style.float = "right";
		deleteButton.onclick = (function() {
			self.removeEntry(uuid, category, catName);
		});

		var editButton = document.createElement("button");
		editButton.classList.add("ui-btn", "ui-btn-inline");
		editButton.innerHTML = "edit";
		editButton.style.float = "right";
		editButton.style.display = "block";
		editButton.onclick = (function() {
			$("#" + uuid).children('div')[0].style.display = "block";
			$("#" + uuid).children('button')[1].style.display = "none";
		});

		entry.appendChild(deleteButton);
		entry.appendChild(editButton);
		entry.appendChild(h3);
		entry.appendChild(h32);

		var input = document.createElement('input');
		input.class = "updateVal";
		input.type="number";
		input.value = val
		input.size = 6
		var p = document.createElement('p');

    	var date = document.createElement('input');
    	date.classList.add("form-control");
    	date.type = "date";

		var updateButton = document.createElement('button');
		updateButton.classList.add("ui-btn", "ui-btn-inline");
		updateButton.innerHTML = "Update";
		updateButton.onclick = (function() {
			$("#" + uuid).children('div')[0].style.display = "none";
			$("#" + uuid).children('button')[1].style.display = "block";
			updateFn(uuid, catName);
		}); 

		var editField = document.createElement('div');
		editField.style.display = "none";
		editField.appendChild(input);
		editField.appendChild(updateButton);
		entry.appendChild(editField);
		entry.appendChild(p);
		entry.appendChild(document.createElement('hr'));
		$(listId).append(entry);

		return uuid;
	};

	this.makeRecurringTemplate = function(category, catName, val, frequency, start, updateFn, listId) {
		var uuid = guid();
		var entry = document.createElement('li');
		entry.id = uuid;

		var h3 = document.createElement('h3');
		h3.innerHTML = catName;
		var h32 = document.createElement('h2');
		h32.innerHTML = "$" + val;
		var deleteButton = document.createElement('button');
		deleteButton.classList.add("ui-btn", "ui-btn-inline");
		deleteButton.innerHTML = "x";
		deleteButton.style.float = "right";
		deleteButton.onclick = (function() {
			self.removeEntry(uuid, category, catName);
		});

		var editButton = document.createElement("button");
		editButton.classList.add("ui-btn", "ui-btn-inline");
		editButton.innerHTML = "edit";
		editButton.style.float = "right";
		editButton.onclick = (function() {
			$("#" + uuid).children('div')[0].style.display = "block";
			$("#" + uuid).children('button')[1].style.display = "none";
		});

		entry.appendChild(deleteButton);
		entry.appendChild(editButton);
		entry.appendChild(h3);
		entry.appendChild(h32);

		var input = document.createElement('input');
		input.class = "updateVal";
		input.type="number";
		input.value = val;
		var p = document.createElement('p');

		var date;
		if(frequency == 'monthly') {
			date = document.createElement('input');
			date.classList.add("form-control");
			date.type = "date";
			if(start != 1) {
				var newDate = new Date(start);
				date.value = dateToDateInput(newDate);
			}
		} else if(frequency == 'weekly') {
			date = document.createElement('select');
			date.classList.add("form-control");
			var dayValue = 0;
			["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].forEach(function(f) {
				var opt = document.createElement('option');
				opt.value = dayValue++;
				opt.innerHTML = f;
				date.appendChild(opt);
			});
			if(start != 1) {
				var newDateA = new Date(start);
				date.value = newDateA.getDay();
			}
		}

		var updateButton = document.createElement('button');
		updateButton.classList.add("ui-btn", "ui-btn-inline");
		updateButton.innerHTML = "Update";
		updateButton.onclick = (function() {
			$("#" + uuid).children('div')[0].style.display = "none";
			updateFn(uuid, catName);
			$("#" + uuid).children('button')[1].style.display = "inline";
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
		editDiv.appendChild(updateButton);
		entry.appendChild(editDiv);
		entry.appendChild(p);
		entry.appendChild(document.createElement('hr'));
		$(listId).append(entry);

		$(select).change(function() {
			var entry = document.getElementById(uuid);
			var val = entry.getElementsByTagName('input')[0].value;
			var select = entry.getElementsByTagName('select')[0];
			var frequency = select.options[select.selectedIndex].value;
			if(frequency == 'monthly') {
				entry.getElementsByClassName('form-control')[0].remove();
				
				var date = document.createElement('input');
				date.classList.add("form-control");
				date.type = "date";
				
				var divParent = entry.getElementsByTagName('div')[0];
				divParent.insertBefore(date, divParent.children[2]);
			} else if(frequency == 'weekly') {
				entry.getElementsByClassName('form-control')[0].remove();
				
				var week = document.createElement('select');
				week.classList.add("form-control");
				var dayValue = 0;
				["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].forEach(function(f) {
					var opt = document.createElement('option');
					opt.value = dayValue++;
					opt.innerHTML = f;
					week.appendChild(opt);
				});
				
				var divParentA = entry.getElementsByTagName('div')[0];
				divParentA.insertBefore(week, divParentA.children[2]);
			}
		});

		return uuid;
	};

	this.removeEntry = function(uuid, category, catName) {
		notifyListeners("removeEntry", [category,
			catName,
			function() {
				document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "REMOVE " + category.toUpperCase() + " SUCCESS";
			}, 
			function(message) {
				document.getElementById(uuid).getElementsByTagName('p')[0].innerHTML = "FAILED: " + message;
		}]);
		document.getElementById(uuid).remove();
	};

	//todo: buggy b/c catName and save switches depending on addEntr
	this.notifyAdd = function(call, category, catName, save, uuid) {
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
	};

	//used for changeEntry
	this.notifyChange = function(call, category, catName, save, uuid) {
		notifyListeners(call, [category,
			catName,
			save,
			function() {
			$("#titleText").notify("UPDATE " + category.toUpperCase() + " SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
		}, function(message) {
			$("#titleText").notify("FAILURE: " + message, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
		}]);

		document.getElementById(uuid).getElementsByTagName('p')[0].value = "";
	};

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

}