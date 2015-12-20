angular.module("oyedelhi")

.controller('profileController', function($rootScope, $scope, $stateParams, $location,$state, UtilitiesService,UserService, $cordovaFacebook, $ionicModal, signupService, $ionicLoading, parseQuery, $cordovaToast){
  $scope.desiredDetails = {};  
  $scope.enrolled = false;
  $scope.enrolmentDetails = {};
  function validationSuccess(){
    if($scope.information.phonenumber && $scope.information.numberplate && $scope.information.location){
      return true;
    }
    else{
      return false;
    }    
  }
  $scope.setUserData = function(){
    $scope.desiredDetails = Parse.User.current().attributes; 
    $scope.fetchDetails();
    $scope.information = {};    
  }
  $scope.signout = function () {
      signupService.logOut();
      $state.go("app.signin");
  }
  $scope.setExistingData = function(){
    $scope.information.phonenumber = $scope.enrolmentDetails.attributes.mobile;
    $scope.information.numberplate = $scope.enrolmentDetails.attributes.platenumber;
  } 
  $scope.enroll = function(){
    $ionicLoading.show()
    var vehicleInfo = Parse.Object.extend("vehicleInfo");
    var vehicle = new vehicleInfo();
    if(validationSuccess()){
      if($scope.enrolled){
        vehicle.id = $scope.enrolmentDetails.id;
        vehicle.set("platenumber",$scope.information.numberplate);
        vehicle.set("mobile",$scope.information.phonenumber);
        vehicle.set("location",new Parse.GeoPoint($scope.information.location.geometry.location.lat(), $scope.information.location.geometry.location.lng()));
        vehicle.save().then(function(success){
          $ionicLoading.hide();
          navigator.notification.alert(
              'Enrolment done successfully!',
              $scope.closeModal(1),         
              'Enrolment Success', 
              'Alrighty'
          );          
        },
        function(error){
          $ionicLoading.hide();
          navigator.notification.alert(
              'Oops! Something went wrong!',
              $scope.closeModal(1),
              'Enrolment Failed',
              'Alrighty'
          );          
          $scope.closeModal(1);
          console.log(error);
        });
      }
      else{
        vehicle.save({
          "platenumber":$scope.information.numberplate.toUpperCase(),
          "mobile":$scope.information.phonenumber,
          "location":new Parse.GeoPoint($scope.information.location.geometry.location.lat(), $scope.information.location.geometry.location.lng()),
          "userid":$scope.desiredDetails.username
        }).then(function(object){
          $ionicLoading.hide()
          $scope.enrolled = true;
          $scope.enrolmentDetails = object;
          $scope.closeModal(1);
        })
        var custom_acl = new Parse.ACL();
        custom_acl.setWriteAccess( Parse.User.current(), true);
        custom_acl.setReadAccess( Parse.User.current(), true);
        custom_acl.setPublicReadAccess(false);
        vehicle.setACL(custom_acl);
      }    
    }
    else{
      $ionicLoading.hide();
      $cordovaToast
        .show('Please fill all fields', 'long', 'center')
        .then(function(success) {
          // success
        }, function (error) {
          // error
        });      
    }
  }
  
  $scope.fetchDetails = function(){
    $ionicLoading.show();
    var query = new Parse.Query("vehicleInfo");
    query.equalTo("userid", $scope.desiredDetails.username);
    query.first({
      success: function(object) {
        if(object){
          $ionicLoading.hide()
          $scope.enrolled = true;
          $scope.enrolmentDetails = object;
        }        
        else{
          $ionicLoading.hide()
          $scope.enrolled = false;
          $scope.enrolmentDetails = {};
        }
      },
      error: function(error) {
        $ionicLoading.hide()
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  }
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

  if(Parse.User.current()){
    $scope.setUserData();
  }
  else{
    $state.go("app.signin");
  }  






  //Modal related code
  $ionicModal.fromTemplateUrl('appointmentdetails.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.oModal1 = modal;
  });
  // Modal 2
  $ionicModal.fromTemplateUrl('orderstatus.html', {
      id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.oModal2 = modal;
  });
  $scope.openModal = function(index) {
      if (index == 1) $scope.oModal1.show();
      else $scope.oModal2.show();
  };
  $scope.closeModal = function(index) {
      if (index == 1) $scope.oModal1.hide();
      else $scope.oModal2.hide();
  };
  $scope.$on('modal.shown', function(event, modal) {
      console.log('Modal ' + modal.id + ' is shown!');
  });
  $scope.$on('modal.hidden', function(event, modal) {
      console.log('Modal ' + modal.id + ' is hidden!');
  });

})
