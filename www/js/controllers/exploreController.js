angular.module('starter')
.controller('exploreController', function($rootScope, $scope, $stateParams, $location,$state, UtilitiesService,UserService, $ionicLoading){
  	$scope.$on('mapInitialized', function(event, map) {
    	$scope.map = map;
  	});

  	$scope.centerOnMe= function(){
  		$scope.position = {lat:12,lng:77};  		
    	$ionicLoading.show({
      		template: 'Loading...'
    	});
    	cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);
    	var successCallback  = function(status){
    		if(status==='enabled'){
    			navigator.geolocation.getCurrentPosition(function(position) {
			      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			      $scope.position = {lat: pos.lat(),lng: pos.lng()};
			      $scope.map.setCenter(pos);
			      $ionicLoading.hide();
			    });
    		}
    		else{
    			cordova.plugins.diagnostic.switchToLocationSettings();
    		}    		
    	}
	    
  	};
})
