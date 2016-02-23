describe("NotificationManager", function() {

    var mock, notificationManager, callback;

    beforeEach(function() {
        mock = {
            getData : jasmine.createSpy('getData'),
            setDataListener : jasmine.createSpy('setDataListener').and.callFake(function(events, cb) {
                callback = cb;
            })
        };

        spyOn(cordova.plugins.notification.local, "clearAll").and.callFake(function(cb) {
            cb();
        });

        spyOn(cordova.plugins.notification.local, "schedule").and.callThrough();

        notificationManager = new NotificationManager(mock.getData, mock.setDataListener);
    
        callback();
    });

    it('should set listener for ready / budget / options', function() {
        expect(mock.setDataListener).toHaveBeenCalledWith(["ready", "tomorrowBudget", "options"], jasmine.any(Function));
    });

    it('should schedule a notification', function() {
        expect(cordova.plugins.notification.local.schedule).toHaveBeenCalled();
    });

});