// If we're in debug mode, do additional debug init
localforage.ready(function() {
	localforage.getItem('debugEnable', function(err, val) {
		if(val || DEBUG_MODE) {
			initDebug();
		} else {
			$("#debug-panel").hide();
			init();
		}
	});
});

// If we're in debug mode, set up our time travel controls and then init
function initDebug() {
	localforage.getItem('daysInFuture', function(err, val) {
		if(val) {
			timeTravel(val);
		}
		setUpFutureDate();
		init();
	});
}

// Initializes and connects all of the objects in the application
function init() {
	var isReadyMiddle = false;

	// Initialize our data representation
	var dataManager = new DataManager();

	// Gives notificationManager access to get data, and to listen for when it changes
	var notificationManager = new NotificationManager(dataManager.getData, dataManager.registerListener);

	// Initializes the network manager. In the future, may give it some access to the UI to listen for
	// logins, but for now, it doesn't have access to any other objects.
	var networkManager = new NetworkManager(dataManager.getData, dataManager.getKeySet(), function() {
		if(isReadyMiddle) {
			dataManager.start();
		} else {
			isReadyMiddle = true;
		}
	});

	// Gives uiView access to get data, and to listen for when it changes
	var uiView = new UIView(dataManager.getData, dataManager.registerListener, networkManager);

	// Gives storageManager access to get, set, and listen to data, as well as the networkManager,
	// and registers a ready callback for it
	var storageManager = new StorageManager(dataManager, networkManager, function() {
		// Everything in here will be called when StorageManager has
		// finished filling DataManager with initial data from phonegap
		// storage.
		if(isReadyMiddle) {
			dataManager.start();
		} else {
			isReadyMiddle = true;
		}
	});

	// Gives uiController access to get, set, and listen to data, and to listen for events in the view
	var uiController = new UIController(dataManager.getData, storageManager, uiView.registerCallback);

	// Make these easily accesible in web inspector for debugging if
	// we're in debug mode.
	if(DEBUG_MODE) {
		window.dataManager = dataManager;
		window.notificationManager = notificationManager;
		window.networkManager = networkManager;
		window.uiView = uiView;
		window.storageManager = storageManager;
	}
}
