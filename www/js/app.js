// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// "oyedelhi" is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module("oyedelhi", [
    'ionic','ionic.service.core',
    'ngCordova',
    'ion-google-place',
    'angularParse'])

    .run(function ($ionicPlatform) {
        // Parse.initialize("dT5yb86GGYTNimERcwEvWUgwOwCofiVv6fUqxbq7", "UZ96bqWUaui215aRIQlnaAJ3OMLVFAcnGyiWJwUH"); //Production
        Parse.initialize("NMOIoPrD327pbokZmtN5GNxopESGCXvpIAn3jxxk", "abANilseoYmdBJtKYbsI9rhzqoXM8xIlGpbPp8cp"); //Staging
        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    });

// curl -u 6d533789b20b53587ab04a4c48abbe324fa23596661dbcdd: -H "Content-Type: application/json" -H "X-Ionic-Application-Id: acb9d28a" https://push.ionic.io/api/v1/push -d '{"tokens":["DEVICE_TOKEN"],"notification":{"alert":"I come from planet Ion."}}'