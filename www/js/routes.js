// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// "oyedelhi" is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module("oyedelhi")

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                cache: true,
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'appController'
            })

            .state('app.signin', {
                cache: true,
                url: '/signin',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/signin.html',
                        controller: 'signinController'
                    }
                }
            })

            .state('app.explore', {
                cache: true,
                url: '/explore',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/map.html',
                        controller: 'mapController'
                    }
                }
            })

            .state('app.requests', {
                cache: true,
                url: '/requests',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/requests.html',
                        controller: 'requestsController'
                    }
                }
            })

            .state('app.chat', {
                cache: true,
                url: '/chat:?requestid&user',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chat.html',
                        controller: 'chatController'
                    }
                }
            })

            .state('app.profile', {
                cache: false,
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'profileController'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/signin');
    });
