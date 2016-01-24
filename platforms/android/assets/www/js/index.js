/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// Some simple code to set up and fire some local
// notifications. This was harder to set up than I
// thought it would be. Does not work using the Phonegap
// developer app, you need to run it on an actual device
// or emulator.
var alarms = {

    setInFiveSec: function() {
        var now = new Date().getTime(),
        _5_sec_from_now = new Date(now + 5 * 1000);

        cordova.plugins.notification.local.schedule({
            id: 1,
            title: 'Scheduled with delay',
            text: 'Test Message 1',
            at: _5_sec_from_now,
            badge: 12
        });
    },
    setInTenMins: function() {
        var now = new Date().getTime(),
        _10_min_from_now = new Date(now + 600 * 1000);

        cordova.plugins.notification.local.schedule({
            id: 2,
            title: 'Scheduled with LONG delay',
            text: 'Test Message 2',
            at: _10_min_from_now,
            badge: 12
        });
    },
    setRecurringOneMin: function() {
        cordova.plugins.notification.local.schedule({
            id: 4,
            every: 1
        });
    },
    setEveryDaySixPM: function() {
        var now = new Date().getTime();
        now.setHours(18);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        cordova.plugins.notification.local.schedule({
            id: 3,
            text: "Recurring 6PM",
            firstAt: now,
            every: "day" // "minute", "hour", "week", "month", "year"
        });
    }

}