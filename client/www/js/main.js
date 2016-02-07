// Uncomment this when running on Device

// document.addEventListener('deviceready', function() {

	var dataManager = new DataManager();
	var notificationManager = new NotificationManager(dataManager.getData, dataManager.registerListener);
	var uiView = new UIView(dataManager.getData, dataManager.registerListener);
	var uiController = new UIController(dataManager, uiView.registerCallback);
	var storageManager = new StorageManager(dataManager, function() {
		dataManager.start();
	});

// }, false);