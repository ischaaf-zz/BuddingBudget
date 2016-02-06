describe("NotificationManager", function() {

    var mock, notificationManager;

    beforeEach(function() {
        mock = {
            getData : jasmine.createSpy('getData'),
            setDataListener : jasmine.createSpy('setDataListener')
        };

        notificationManager = new NotificationManager(mock.getData, mock.setDataListener);
    });

    it('should set listener for ready', function() {
        expect(mock.setDataListener).toHaveBeenCalledWith("ready", jasmine.any(Function));
    });

    it('should set listener for budget / options', function() {
        expect(mock.setDataListener).toHaveBeenCalledWith(["budget", "options"], jasmine.any(Function));
    });

});