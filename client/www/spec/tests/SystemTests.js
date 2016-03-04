describe("System Tests", function() {

	var dataManager, notificationManager, networkManager, storageManager, uiController, uiView;

	var callbacks = {};
	
	beforeEach(function() {

		PERSIST_DATA = true;

		clearStorage();

		// Initialize our data representation
		dataManager = new DataManager();

		// Gives notificationManager access to get data, and to listen for when it changes
		notificationManager = new NotificationManager(dataManager.getData, dataManager.registerListener);

		// Initializes the network manager. In the future, may give it some access to the UI to listen for
		// logins, but for now, it doesn't have access to any other objects.
		networkManager = new NetworkManager(dataManager.getData, [], function() {});

		// Gives uiView access to get data, and to listen for when it changes
		uiView = {
			registerCallback : function(event, callback) {
				callbacks[event] = callback;
			}
		}

		// Gives storageManager access to get, set, and listen to data, as well as the networkManager,
		// and registers a ready callback for it
		storageManager = new StorageManager(dataManager, networkManager, function() {
			// Everything in here will be called when StorageManager has
			// finished filling DataManager with initial data from phonegap
			// storage.
			dataManager.start();
		});

		// Gives uiController access to get, set, and listen to data, and to listen for events in the view
		uiController = new UIController(dataManager.getData, storageManager, uiView.registerCallback);
	});

	describe("setting assets", function() {

		describe("with valid data", function() {

			var oldAssets, newAssets, forageAssets;

			beforeEach(function(done) {
				oldAssets = dataManager.getData('assets');
				callbacks["updateAssets"](100);
				newAssets = dataManager.getData('assets');
				setTimeout(function() {
					localforage.getItem('assets', function(err, val) {
						forageAssets = val;
						done();
					});
				}, 100);
			});

			it("should update assets", function() {
				expect(oldAssets).not.toEqual(100);
				expect(newAssets).toEqual(100);
			});

			it("should update localforage", function() {
				expect(forageAssets).toEqual(100);
			});

		});

	});

});