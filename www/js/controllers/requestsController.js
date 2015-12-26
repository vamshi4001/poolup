/**
 * Created by pradyumnad on 12/25/15.
 */
var app = angular.module("oyedelhi");
app.controller('requestsController', function ($rootScope, $scope, $stateParams, $location, $state, UtilitiesService, RequestService, $ionicLoading) {

    $scope.fetchRequests = function () {
        RequestService.requestsFromMe(function (object) {
            $scope.fromRequests = object;
        }, function (error) {

        });

        RequestService.requestsToMe(function (object) {
            $scope.toRequests = object;
        }, function (error) {

        });
    };

    $scope.doRefresh = function () {
        console.log("Refreshed");
        $scope.fetchRequests();
        $scope.$broadcast('scroll.refreshComplete');
    };

    //Initial call to get the requests.
    $scope.fetchRequests();

    $scope.ignoreRequest = function (req) {
        req.set("status", "ignored");
        req.save(null, {
            success: function(req) {
                alert("Ignored");
                $scope.doRefresh()
            },

            error: function(req, error) {
                alert(error.message);
            }
        });
    };

    $scope.chat = function (req, user) {
        $state.go("app.chat", {requestid: req.id, user: JSON.stringify(user)})
    };
});
