/**
 * Created by pradyumnad on 12/25/15.
 */
var app = angular.module("oyedelhi");
app.controller('chatController', function ($rootScope, $scope, $stateParams,
                                           $location, $state, UtilitiesService,
                                           RequestService, ChatService, $ionicLoading) {

    $scope.message = "";
    $scope.messages = [];

    $scope.user = JSON.parse($stateParams.user);

    console.log($stateParams.requestid);
    console.log($stateParams.user);


    $scope.fetchRequest = function (id) {
        var Request = Parse.Object.extend("Request");
        var query = new Parse.Query(Request);
        query.get($stateParams.requestid, {
            success: function (object) {
                $scope.request = object;
                console.log(object);
                $scope.fetchMessages();
            },
            error: function (error) {
                alert(error.message);
            }
        });
    };

    $scope.saveMessage = function (content) {
        console.log(content);
        ChatService.create(content, $scope.request, $scope.user, function (message) {
            $scope.message = "";
        });
    };

    $scope.fetchMessages = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
        ChatService.messages($scope.request, function (results) {
            console.log(results);
            $scope.messages = results;
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading.hide();
            alert(error.message);
        });
    };

    $scope.doRefresh = function () {
        $scope.fetchMessages();
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.$on('$ionicView.beforeEnter', function(){
        // Any thing you can think of
        $scope.fetchRequest($stateParams.requestid);
    });
});