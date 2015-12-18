angular.module("starter")
 	.controller('signinController', ['$state','$scope','$rootScope', '$http', 'UserService','UtilitiesService', 'signupService',function ($state, $scope, $rootScope, $http, UserService, UtilitiesService, signupService) {
	    $scope.fbLogin = function () {
            signupService.fbSignUp().then(function(data){
                $state.go("app.profile")
            });
        }
	}]);