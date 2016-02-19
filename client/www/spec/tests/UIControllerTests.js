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
            expect(mockSM.updateAssets).toHaveBeenCalledWith(100, jasmine.any(Function), jasmine.any(Function));
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

    describe("trackSpending callback", function() {

        it("should change value when valid", function() {
            var entry = new TrackEntry(10, 5, 100);
            callbacks.trackSpending(entry, "foo", success, failure);
            expect(mockSM.trackSpending).toHaveBeenCalledWith(entry, "foo", jasmine.any(Function), jasmine.any(Function));
        });

        it("should throw type error if wrong type", function() {
            var entry = "potato";
            callbacks.trackSpending(entry, "foo", success, failure);
            expect(failure).toHaveBeenCalled();
            expect(mockSM.trackSpending).not.toHaveBeenCalled();
        });

    });

    describe("setOption callback", function() {

        it("should change option", function() {
            callbacks.setOption("foo", "bar", success, failure);
            expect(failure).not.toHaveBeenCalled();
            expect(mockSM.setOption).toHaveBeenCalledWith("foo", "bar", jasmine.any(Function), jasmine.any(Function));
        });

    });

    describe("addEntry callback", function() {

        describe("should succeed with valid category", function() {

            function commonTest(category) {
                callbacks.addEntry(category, "foo", success, failure);
                expect(failure).not.toHaveBeenCalled();
                expect(mockSM.addEntry).toHaveBeenCalledWith(category, "foo", jasmine.any(Function), jasmine.any(Function));
            }

            it("such as savings", function() {
                commonTest("savings");
            });

            it("such as income", function() {
                commonTest("income");
            });

            it("such as charges", function() {
                commonTest("charges");
            });

        });

        it("should fail with invalid category", function() {
            callbacks.addEntry("potato", "foo", success, failure);
            expect(failure).toHaveBeenCalled();
            expect(mockSM.addEntry).not.toHaveBeenCalled();
        });

    });

    describe("changeEntry callback", function() {
        
        describe("should succeed with valid category", function() {

            function commonTest(category) {
                callbacks.changeEntry(category, "foo", "bar", success, failure);
                expect(failure).not.toHaveBeenCalled();
                expect(mockSM.changeEntry).toHaveBeenCalledWith(category, "foo", "bar", jasmine.any(Function), jasmine.any(Function));
            }

            it("such as savings", function() {
                commonTest("savings");
            });

            it("such as income", function() {
                commonTest("income");
            });

            it("such as charges", function() {
                commonTest("charges");
            });

        });

        it("should fail with invalid category", function() {
            callbacks.changeEntry("potato", "foo", "bar", success, failure);
            expect(failure).toHaveBeenCalled();
            expect(mockSM.changeEntry).not.toHaveBeenCalled();
        });

    });

    describe("removeEntry callback", function() {

        describe("should succeed with valid category", function() {

            function commonTest(category) {
                callbacks.removeEntry(category, "foo", success, failure);
                expect(failure).not.toHaveBeenCalled();
                expect(mockSM.removeEntry).toHaveBeenCalledWith(category, "foo", jasmine.any(Function), jasmine.any(Function));
            }

            it("such as savings", function() {
                commonTest("savings");
            });

            it("such as income", function() {
                commonTest("income");
            });

            it("such as charges", function() {
                commonTest("charges");
            });

        });

        it("should fail with invalid category", function() {
            callbacks.removeEntry("potato", "foo", success, failure);
            expect(failure).toHaveBeenCalled();
            expect(mockSM.removeEntry).not.toHaveBeenCalled();
        });

    });

});