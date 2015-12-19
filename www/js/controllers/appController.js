angular.module("oyedelhi")
.controller('appController', function($scope, $ionicModal, $timeout, signupService, $state) {
	$scope.signout = function () {
      signupService.logOut();
      $state.go("app.signin");
  	}  
})