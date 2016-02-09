describe("StorageManager", function() {

    var storageManager, mockData, mockNetwork, readyCB;

    beforeEach(function() {
    	mockData = {
    		registerListener: jasmine.createSpy('registerListener')
    	};
        mockNetwork = {
            fetchInitialData: jasmine.createSpy('fetchInitialData')
        }
    	readyCB = jasmine.createSpy('readyCB');
        storageManager = new StorageManager(mockData, mockNetwork, readyCB);
    });

    it('should call its ready CB', function() {
    	expect(readyCB).toHaveBeenCalled();
    });

});