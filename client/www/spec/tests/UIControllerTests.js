describe("UIController", function() {

    var callbacks, mockDM, mockSM, uiController, success, failure;

    beforeEach(function() {
        success = jasmine.createSpy('success')
        failure = jasmine.createSpy('failure')

        callbacks = {};

        registerUICallback = function(name, callback) {
            callbacks[name] = callback;
            spyOn(callbacks, name).and.callThrough();
        }

        mockDM = {
            getData: function(category) {
                return simpleSampleData[category];
            }
        }
        spyOn(mockDM, 'getData').and.callThrough();

        mockSM = {
            updateAssets: jasmine.createSpy('updateAssets'),
            trackSpending: jasmine.createSpy('trackSpending'),
            setOption: jasmine.createSpy('setOption'),
            addEntry: jasmine.createSpy('addEntry'),
            changeEntry: jasmine.createSpy('changeEntry'),
            removeEntry: jasmine.createSpy('removeEntry'),
        }

        uiController = new UIController(mockDM.getData, mockSM, registerUICallback);
    });

    describe("updateAssets callback", function() {

        it("should change value when valid", function() {
            callbacks.updateAssets(100, success, failure);
            expect(mockSM.updateAssets).toHaveBeenCalledWith(100);
            expect(success).toHaveBeenCalled();
        });

        it("should throw NaN error if NaN", function() {
            callbacks.updateAssets(NaN, success, failure);
            expect(mockSM.updateAssets).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalledWith('Cannot set assets to NaN');
        });

        it("should throw type error if wrong type", function() {
            callbacks.updateAssets('potato', success, failure);
            expect(mockSM.updateAssets).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalledWith('Cannot set assets to string');
        });

    });

    // describe("trackSpending callback", function() {

    // });

    // describe("setOption callback", function() {

    // });

    // describe("addEntry callback", function() {

    // });

    // describe("changeEntry callback", function() {

    // });

    // describe("removeEntry callback", function() {

    // });

});