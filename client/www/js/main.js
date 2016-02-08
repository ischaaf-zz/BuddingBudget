// Initializes and connects all of the objects in the application

// Uncomment this when running on Device
// document.addEventListener('deviceready', function() {

	// Initialize our data representation
	var dataManager = new DataManager();

	// Gives notificationManager access to get data, and to listen for when it changes
	var notificationManager = new NotificationManager(dataManager.getData, dataManager.registerListener);

	// Gives uiView access to get data, and to listen for when it changes
	var uiView = new UIView(dataManager.getData, dataManager.registerListener);

	// Gives uiController access to get, set, and listen to data, and to listen for events in the view
	var uiController = new UIController(dataManager, uiView.registerCallback);

	// Gives storageManager access to get, set, and listen to data, and registers a ready callback for it
	var storageManager = new StorageManager(dataManager, function() {
		// Everything in here will be called when StorageManager has
		// finished filling DataManager with initial data from phonegap
		// storage.
		dataManager.start();
	});

// }, false);