describe("UIController", function() {

    var uiController, mock, registerUICallback;

    beforeEach(function() {
    	registerUICallback = jasmine.createSpy('registerUICallback');
        uiController = new UIController(mock, registerUICallback);
    });

    it('should register UI Callback for sendNewData', function() {
        expect(registerUICallback).toHaveBeenCalledWith("sendNewData", jasmine.any(Function));
    });

    it('should register UI Callback for changeData', function() {
        expect(registerUICallback).toHaveBeenCalledWith("changeData", jasmine.any(Function));
    });

    it('should register UI Callback for removeData', function() {
        expect(registerUICallback).toHaveBeenCalledWith("removeData", jasmine.any(Function));
    });

});