// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// "oyedelhi" is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module("oyedelhi")

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'appController'
            })

            .state('app.signin', {
                url: '/signin',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/signin.html',
                        controller: 'signinController'
                    }
                }
            })

            .state('app.explore', {
                url: '/explore',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/map.html',
                        controller: 'mapController'
                    }
                }
            })

            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'profileController'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/explore');
    });
