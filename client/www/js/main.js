// Initializes and connects all of the objects in the application

// Uncomment this when running on Device
// document.addEventListener('deviceready', function() {

localforage.ready(function() {

	localforage.getItem('daysInFuture', function(err, val) {

		if(val) {
			timeTravel(val);
		}

		// Initialize our data representation
		var dataManager = new DataManager();

		// Gives notificationManager access to get data, and to listen for when it changes
		var notificationManager = new NotificationManager(dataManager.getData, dataManager.registerListener);

		// Initializes the network manager. In the future, may give it some access to the UI to listen for
		// logins, but for now, it doesn't have access to any other objects.
		var networkManager = new NetworkManager();

		// Gives uiView access to get data, and to listen for when it changes
		var uiView = new UIView(dataManager.getData, dataManager.registerListener, networkManager.login, networkManager.registerListener);

		// Gives storageManager access to get, set, and listen to data, as well as the networkManager,
		// and registers a ready callback for it
		var storageManager = new StorageManager(dataManager, networkManager, function() {
			// Everything in here will be called when StorageManager has
			// finished filling DataManager with initial data from phonegap
			// storage.
			dataManager.start();
		});

		// Gives uiController access to get, set, and listen to data, and to listen for events in the view
		var uiController = new UIController(dataManager.getData, storageManager, uiView.registerCallback);

		window.dataManager = dataManager;
		window.notificationManager = notificationManager;
		window.networkManager = networkManager;
		window.uiView = uiView;
		window.storageManager = storageManager;

		//setEndDate(5);

	});

});

// }, false);