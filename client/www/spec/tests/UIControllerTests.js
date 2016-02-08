describe("UIController", function() {

    var callbacks, mockDM, uiController, success, failure;

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
            },
            setData: function(category, value) {}
        }
        spyOn(mockDM, 'getData').and.callThrough();
        spyOn(mockDM, 'setData').and.callThrough();

        uiController = new UIController(mockDM, registerUICallback);
    });

    describe("updateAssets callback", function() {

        it("should change value when valid", function() {
            callbacks.updateAssets(100, success, failure);
            expect(mockDM.setData).toHaveBeenCalledWith('assets', 100);
            expect(success).toHaveBeenCalled();
        });

        it("should throw NaN error if NaN", function() {
            callbacks.updateAssets(NaN, success, failure);
            expect(mockDM.setData).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalledWith('Cannot set assets to NaN');
        });

        it("should throw type error if wrong type", function() {
            callbacks.updateAssets('potato', success, failure);
            expect(mockDM.setData).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalledWith('Cannot set assets to string');
        });

    });

});