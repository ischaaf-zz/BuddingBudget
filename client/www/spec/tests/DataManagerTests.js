describe('DataManager', function() {

    var dataManager;

    beforeEach(function() {
        dataManager = new DataManager();
        dataManager.start();
    });

    it('should set and get data', function() {
        dataManager.setData("assets", 5);
        expect(dataManager.getData("assets")).toEqual(5);
    });

    it('can\'t set invalid data type', function() {
        dataManager.setData("potato", 3);
        expect(dataManager.getData("potato")).toEqual(undefined);
    });

    it('fires ready event', function() {
        var readyCalled = false;
        dataManager.registerListener('ready', function() {
            readyCalled = true;
        });
        dataManager.start();
        expect(readyCalled).toEqual(true);
    });

    it('fires single change callback', function() {
        var savingsCalled = false;
        dataManager.registerListener('savings', function() {
            savingsCalled = true;
        });
        dataManager.setData("savings", [1]);
        expect(savingsCalled).toEqual(true);
    });

    it('allows registering multiple callbacks', function() {
        var counter = 0;
        dataManager.registerListener(['savings', 'charges'], function(type) {
            counter++;
        });
        // Neither should be called
        expect(counter).toEqual(0);
        dataManager.setData("savings", [1], true);
        // ONLY savings should be called
        expect(counter).toEqual(1);
        dataManager.setData("charges", [1], true);
        // Both should be called
        expect(counter).toEqual(2);
    });

    it("shouldn't allow access to internal data through setData", function() {
        var insertData = [{test: 3}];
        dataManager.setData("savings", insertData);

        insertData[0].test = 4;
        
        var retrieveData = dataManager.getData("savings");
        expect(retrieveData[0].test).toEqual(3);
    });

    it("shouldn't allow access to internal data through getData", function() {
        dataManager.setData("savings", [{test: 3}]);

        var retrieveData = dataManager.getData("savings");
        retrieveData[0].test = 4;

        var secondRetrieve = dataManager.getData("savings");
        expect(secondRetrieve[0].test).toEqual(3);
    });

});
