/**
 * Created by pradyumnad on 12/25/15.
 */
var app = angular.module("oyedelhi");
app.controller('chatController', function ($rootScope, $scope, $stateParams,
                                           $location, $state, UtilitiesService,
                                           RequestService, ChatService, $ionicLoading, $ionicScrollDelegate, $interval, $timeout) {

    $scope.message = "";
    $scope.messages = [];
    var messageCheckTimer;
    $scope.selectedRequestId = $stateParams.requestid;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    $scope.user = JSON.parse($stateParams.user);

    $scope.closeKeyboard = function() {
        cordova.plugins.Keyboard.close();
    };
    $scope.fetchRequest = function (id) {
        var Request = Parse.Object.extend("Request");
        var query = new Parse.Query(Request);
        query.get($stateParams.requestid, {
            success: function (object) {
                $scope.request = object;
                $scope.fetchMessages();
            },
            error: function (error) {
                console.log(error.message);
            }
        });
    };

    $scope.saveMessage = function (content) {
        ChatService.create(content, $scope.request, $scope.user, function (message) {
            $scope.message = "";
            $scope.fetchRequest($stateParams.requestid);
        });
    };

    $scope.fetchMessages = function () {
        ChatService.messages($scope.request, function (results) {
            $scope.messages = results;
            $ionicScrollDelegate.scrollBottom(true);
        }, function (error) {
            console.log(error.message);
        });
    };

    $scope.doRefresh = function () {
        $scope.fetchMessages();
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.$on('$ionicView.enter', function(){
        $scope.fetchRequest($stateParams.requestid);
        messageCheckTimer = $interval(function() {
            // here you could check for new messages 
            //if your app doesn't use push notifications or user disabled them
            $scope.fetchRequest($stateParams.requestid);
        }, 80000);
    });
    $scope.$on('$ionicView.leave', function() {
        // Make sure that the interval is destroyed
        if (angular.isDefined(messageCheckTimer)) {
            $interval.cancel(messageCheckTimer);
            messageCheckTimer = undefined;
        }
    });
});