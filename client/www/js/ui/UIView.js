// THIS FILE SHOULD BE THE ONLY PLACE THE DOM IS MANIPULATED
// Handles sending new data and commands out from the DOM, and
// putting new updated data into the DOM
var UIView = function(getData, setDataListener, networkManager) {
	// events: updateAssets, trackSpending, setOption, 
	//		   addEntry, changeEntry, removeEntry
	var self = this;

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

	//initially loaded elements
	setDataListener('ready', function(isNew) {

		var pageTransitions = new PageTransitions();

		var entryHelpers = new EntryHelpers(notifyListeners);

		var tutorialUI = new TutorialUI(isNew, self.registerCallback, pageTransitions);

		new BudgetUI(getData, setDataListener);
		new AssetsUI(getData, setDataListener, notifyListeners);
		new TrackedSpendingUI(getData, setDataListener, notifyListeners);
		new SavingsUI(getData, entryHelpers);
		new ChargeUI(getData, entryHelpers);
		new IncomeUI(getData, entryHelpers);
		new OptionsUI(getData, setDataListener, notifyListeners);
		new LoginUI(networkManager.login, networkManager.addUser, networkManager.logout, networkManager.getLoggedInUser, tutorialUI.tutorialChangePage);
	});

	// Open side menu on swipe from left edge
	$(window).on("swiperight", function(info) {
		if(info.swipestart.coords[0] < 50) {
			$("#menuBar").click();
		}
	});
	
};