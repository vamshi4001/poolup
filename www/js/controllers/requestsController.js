/**
 * Created by pradyumnad on 12/25/15.
 */
var app = angular.module("oyedelhi");
app.controller('requestsController', function ($rootScope, $scope, $stateParams, $location, $state, UtilitiesService, UserService, $ionicLoading) {
    alert(UserService.getId());

    $scope.fetchRequests = function () {

    }
});
