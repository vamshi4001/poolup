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
        Parse.initialize("LCl7WoAf8VO1ClzCcfKONQtr7eP3TX8f0hMwYrT7", "diprUKtkGfwHw1i0cC3DseEaznuUItWNqZlMjKMx"); //Staging
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            //if (window.cordova && window.cordova.plugins.Keyboard) {
            //    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            //    cordova.plugins.Keyboard.disableScroll(true);
            //
            //}
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
