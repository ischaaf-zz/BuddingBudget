// Set the end date - a convenient helper function so we don't have to set it through
// the calendar every time we clear the data and test.
function setEndDate(daysInFuture) {
	storageManager.setEndDate((new Date()).getTime() + (24 * 60 * 60 * 1000 * daysInFuture));
}

// Set what day we're time traveling to relative to today
// Changes take effect upon refresh.
function setTimeTravel(days) {
	localforage.setItem('daysInFuture', days);
}

// Makes the app think that it's daysInFuture away from the real today
// Needs to be called before any of the objects are initialized to work properly
function timeTravel(daysInFuture) {
	window.OtherDate = Date;
	// Need to disable jshint's warnings for this - it's a sort of nasty
	// bit of code, but being able to change what Javascript thinks the
	// current Date is is invaluable for testing.
	/*jshint -W020 */
	Date = function() {
		// if we're constructing a Date object with no arguments to get the current time
		if(arguments.length === 0 || arguments[0] === undefined) {
			// Offset it by daysInFuture * MILLISECONDS_PER_DAY
			var data = (new OtherDate()).getTime() + (daysInFuture * MILLISECONDS_PER_DAY);
			return(new OtherDate(data));
		}

		// Otherwise, just pass the arguments through
		var args = [];
		for(var i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		var date = new (Function.prototype.bind.apply(OtherDate, [null].concat(args)))();

		return date;
	};
}

// Set up our future date picker if we're in debug mode
function setUpFutureDate() {
	// Potentially a real date object, or an overwritten date object
	var simuDate = new Date();

	$("#futureDate").val(dateToDateInput(simuDate));

	$("#futureDate").change(function() {
		// now is a real date object, not an overwritten one
		var now = window.OtherDate ? new OtherDate() : new Date();
		var future = dateInputToDate($(this).val());
		setTimeTravel(Math.ceil((future - now) / MILLISECONDS_PER_DAY));
		$("#timeMachineControls").html("Refresh to change date");
	});
}


$("#resetStorage").click(function() {
	clearStorage();
	$("#resetNote").html("Storage cleared. Reload/reopen app to see default state.");
});

var debugClickCount = 0;
var debugClickTimeout;

$("#debugToggle").click(function() {
	clearTimeout(debugClickTimeout);
	debugClickCount++;
	if(debugClickCount > 8) {
		if (confirm('Tap ok and restart app to enable debug mode!')) {
		    localforage.setItem('debugEnable', true);
		} else {
		    debugClickCount = 0;
		}
	} else {
		debugClickTimeout = setTimeout(function() {
			debugClickCount = 0;
		}, 2000);
	}
});

$("#exitDebug").click(function() {
	localforage.removeItem('debugEnable');
	$("#resetNote").html("Debug disabled. Reload/reopen app to return to normal.");
})