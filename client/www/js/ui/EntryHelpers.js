function EntryHelpers(notifyListeners) {

	//--------------------------------------
	// 	Dynamically create elements (savings, charges, income)
	//--------------------------------------

	var self = this;
	
	//hide entry editing on menu click
	$("#menuBar").click(function() {
		var listSave = $("#savingsList").find('li');
		listSave.each(function(index) {
			var currentEntry = listSave[index];
			var id = currentEntry.id;
			$("#" + id).children('div')[0].style.display = "none";
		});
		
		var listCharges = $("#chargesList").find('li');
		listCharges.each(function(index) {
			var currentEntry = listCharges[index];
			var id = currentEntry.id;
			$("#" + id).children('div')[0].style.display = "none";
		});
		
		var listIncome = $("#incomeList").find('li');
		listIncome.each(function(index) {
			var currentEntry = listIncome[index];
			var id = currentEntry.id;
			$("#" + id).children('div')[0].style.display = "none";
		});
	});
	
	//make new element
	this.makeTemplate = function(category, catName, val, updateFn, listId) {
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
			self.removeEntry(uuid, category, catName);
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
		// li.appendChild(editDiv);

		var input = document.createElement('input');
		input.class = "updateVal";
		input.type="number";
		var p = document.createElement('p');

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
	};

	this.makeRecurringTemplate = function(category, catName, val, frequency, start, updateFn, listId) {
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
			self.removeEntry(uuid, category, catName);
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

		$(select).change(function() {
			var li = document.getElementById(uuid);
			var val = li.getElementsByTagName('input')[0].value;
			var select = li.getElementsByTagName('select')[0];
			var frequency = select.options[select.selectedIndex].value;
			if(frequency == 'monthly') {
				li.getElementsByClassName('form-control')[0].remove();
				
				var date = document.createElement('input');
				date.classList.add("form-control");
				date.type = "date";
				
				var divParent = li.getElementsByTagName('div')[0];
				divParent.insertBefore(date, divParent.children[2]);
			} else if(frequency == 'weekly') {
				li.getElementsByClassName('form-control')[0].remove();
				
				var week = document.createElement('select');
				week.classList.add("form-control");
				var dayValue = 0;
				["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].forEach(function(f) {
					var opt = document.createElement('option');
					opt.value = dayValue++;
					opt.innerHTML = f;
					week.appendChild(opt);
				});
				
				var divParentA = li.getElementsByTagName('div')[0];
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