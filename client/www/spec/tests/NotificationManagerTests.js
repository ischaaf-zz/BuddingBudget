describe("NotificationManager", function() {

    var mock, notificationManager;

    beforeEach(function() {
        mock = {
            getData : jasmine.createSpy('getData'),
            setDataListener : jasmine.createSpy('setDataListener')
        };

        spyOn(cordova.plugins.notification.local, "schedule").and.callThrough();

        notificationManager = new NotificationManager(mock.getData, mock.setDataListener);
    });

    it('should set listener for ready', function() {
        expect(mock.setDataListener).toHaveBeenCalledWith("ready", jasmine.any(Function));
    });

    it('should set listener for budget / options', function() {
        expect(mock.setDataListener).toHaveBeenCalledWith(["budget", "options"], jasmine.any(Function));
    });

    it('should schedule a notification', function() {
        expect(cordova.plugins.notification.local.schedule).toHaveBeenCalled();
    });

});