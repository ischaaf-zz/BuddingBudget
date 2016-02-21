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

    it('should set listener for ready / budget / options', function() {
        expect(mock.setDataListener).toHaveBeenCalledWith(["ready", "budget", "options"], jasmine.any(Function));
    });

    it('should schedule a notification', function() {
        expect(cordova.plugins.notification.local.schedule).toHaveBeenCalled();
    });

});