/**
 * Created by pradyumnad on 12/19/15.
 */
angular.module("oyedelhi")
    .controller('mapController', function ($scope, $ionicLoading, $compile, $cordovaToast) {
        $scope.currentLocation = null;
        var meimg = "img/me.png";
        var carsimg = "img/car.png";
        var oldMarkers = [];
        // centerOnMe -> initiateMap -> fetchCoordinates n map them
        var prevCenter;
        $scope.addMeMarker = function (coord, icon) {
            var marker = new google.maps.Marker({
                position: coord,
                map: $scope.map,
                title: 'Hello World!',
                icon:meimg
            });
            prevCenter = marker;
        };
        $scope.addCarMarker = function (coord, icon) {
            var marker = new google.maps.Marker({
                position: coord,
                map: $scope.map,
                title: 'Hello World!',
                icon:carsimg
            });
            oldMarkers.push(marker);
        };

        $scope.initiateMap = function (centerCoords) {
            $scope.currentLocation = centerCoords;
            var mapOptions = {
                center: centerCoords,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            $scope.map = map;
            google.maps.event.trigger($scope.map, 'resize');
            $scope.map.setCenter(centerCoords);
            $scope.map.setZoom($scope.map.getZoom());
            google.maps.event.addListener($scope.map, 'dragend', function() {
                prevCenter.setMap(null);
                var center = $scope.map.getCenter();
                $scope.map.setCenter(center);
                google.maps.event.trigger($scope.map, 'resize');
                $scope.map.setZoom($scope.map.getZoom());
                $scope.addMeMarker(center);
                $scope.currentLocation = center;      
                $scope.fetchCoordinates();
            });
            $ionicLoading.hide();
            $scope.addMeMarker({lat: centerCoords.lat(), lng: centerCoords.lng()}, "icon");
            $scope.fetchCoordinates();
        };
        $scope.centerOnMe = function () {
            $ionicLoading.show();
            var options = {timeout: 3000, enableHighAccuracy: true, maximumAge: 10000};
            navigator.geolocation.getCurrentPosition(function (pos) {
                $scope.currentLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
                $scope.initiateMap($scope.currentLocation);
            }, function (error) {
                $ionicLoading.hide();
                navigator.notification.confirm(
                    'Enable location settings!', // message
                     onConfirm,            // callback to invoke with index of button pressed
                    'Location',           // title
                    ['Settings','No']     // buttonLabels
                );
            }, options);
        };
        function onConfirm(buttonIndex){
            if(buttonIndex==1){                
                setTimeout($scope.openLocationSettings(), 3000);
            }
            else{
                $cordovaToast
                    .show("Can't fetch location! Setting to defaults", 'long', 'center')
                    .then(function(success) {}, function (error) {});      
                $scope.initiateMap(new google.maps.LatLng(28.6540471, 77.1732288));
            }
        }
        document.addEventListener("resume", onResume, false);
        function onResume() {
            console.log("forground aa gaya");
            $scope.centerOnMe();
        }        
        function successCallback(){
            console.log("opened settings");
        }
        function errorCallback(){
            $cordovaToast
                    .show("Uh Oh! Something went wrong with settings", 'long', 'center')
                    .then(function(success) {}, function (error) {});
        }
        $scope.openLocationSettings = function () {
            if(typeof cordova.plugins.settings.openSetting != undefined)
                cordova.plugins.settings.openSetting("location_source", successCallback,errorCallback);
        };
        $scope.fetchCoordinates = function () {
            $ionicLoading.show();
            if(oldMarkers && oldMarkers.length !== 0){
                for (var i = 0; i < oldMarkers.length; i++) {
                   oldMarkers[i].setMap(null);
                };    
                oldMarkers = [];
            }
            var vehicleInfo = Parse.Object.extend("vehicleInfo");
            var vehicle = new Parse.Query(vehicleInfo);
            var location = new Parse.GeoPoint($scope.currentLocation.lat(), $scope.currentLocation.lng());
            vehicle.withinKilometers("location", location, 5);
            vehicle.find({
                success: function (objects) {
                    console.log("after location");
                    console.log(objects);
                    $scope.locations = [];
                    $.each(objects, function (i, v) {
                        $scope.locations.push(v.attributes);
                        $scope.addCarMarker(new google.maps.LatLng(v.attributes.location._latitude, v.attributes.location._longitude))
                    })
                    $ionicLoading.hide();
                },
                error: function (error) {
                    console.log("An error occured :(");
                }
            });
        };
        $scope.clickTest = function () {
            alert('Example of infowindow with ng-click')
        };
    });