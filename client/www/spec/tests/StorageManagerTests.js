describe("StorageManager", function() {

    var storageManager, mock, readyCB;

    beforeEach(function() {
    	mock = {
    		registerListener: jasmine.createSpy('registerListener')
    	};
    	readyCB = jasmine.createSpy('readyCB');
        storageManager = new StorageManager(mock, readyCB);
    });

    it('should register listeners', function() {
        expect(mock.registerListener).toHaveBeenCalled();
    });

    it('should call its ready CB', function() {
    	expect(readyCB).toHaveBeenCalled();
    });

});