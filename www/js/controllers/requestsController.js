/**
 * Created by pradyumnad on 12/25/15.
 */
var app = angular.module("oyedelhi");
app.controller('requestsController', function ($rootScope, $scope, $stateParams, $location, $state, UtilitiesService, RequestService, $ionicLoading, $cordovaToast) {

    $scope.fetchRequests = function (source) {        
        if(source=="tome"){
            RequestService.requestsToMe(function (object) {
                $scope.toRequests = object;
            }, function (error) {})
        }
        else if(source=="byme"){
            RequestService.requestsFromMe(function (object) {
                $scope.fromRequests = object;
            }, function (error) {});    
        }
        else{
            RequestService.requestsToMe(function (object) {
                $scope.toRequests = object;
            }, function (error) {});
            RequestService.requestsFromMe(function (object) {
                $scope.fromRequests = object;
            }, function (error) {}); 
        }
    };

    $scope.doRefresh = function (source) {
        $scope.fetchRequests(source);
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.takeAction = function(request){
        $scope.selectedRequest = request;
        navigator.notification.confirm(
            'Action on request from '+request.attributes.to.attributes.name, // message
            onActionTaken,            // callback to invoke with index of button pressed
            'Request Action',           // title
            ['Chat', 'Ignore']     // buttonLabels
        )
    }
    function onActionTaken(buttonIndex) {
        if (buttonIndex == 1) {
            $scope.chat($scope.selectedRequest, $scope.selectedRequest.attributes.to)
        }
        else {
            $scope.ignoreRequest($scope.selectedRequest)
        }
    }
    $scope.ignoreRequest = function (req) {
        req.set("status", "ignored");
        req.save(null, {
            success: function(req) {
                $cordovaToast
                    .show("Ignored selected request", 'long', 'bottom')
                    .then(function (success) {}, function (error) {});
                $scope.doRefresh()
            },

            error: function(req, error) {
                $cordovaToast
                    .show("Something went wrong!", 'long', 'bottom')
                    .then(function (success) {}, function (error) {});
                alert(error.message);
            }
        });
    };

    $scope.chat = function (req, user) {
        $state.go("app.chat", {requestid: req.id, user: JSON.stringify(user)})
    };

    //Initial call to get the requests.
    $scope.fetchRequests('tome');
    $scope.fetchRequests('byme');

});
