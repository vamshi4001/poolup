angular.module("oyedelhi")
    .controller('signinController', function ($state, $scope, $rootScope, $ionicLoading, $http, UserService, UtilitiesService, signupService) {
        $scope.fbLogin = function () {
            $ionicLoading.show();
            signupService.fbSignUp().then(function (data) {
                UserService.setId(data.id);
                $ionicLoading.hide();
                $state.go("app.profile")
            });
        }
    });