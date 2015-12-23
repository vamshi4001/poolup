// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// "oyedelhi" is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module("oyedelhi", [
    'ionic',
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
    })
