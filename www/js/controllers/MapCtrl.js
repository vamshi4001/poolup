/**
 * Created by pradyumnad on 12/19/15.
 */
angular.module("oyedelhi")
    .controller('MapCtrl', function ($scope, $ionicLoading, $compile) {
        $scope.currentLocation = null

        // centerOnMe -> initiateMap -> fetchCoordinates n map them

        $scope.addMarker = function (coord, icon) {
            var marker = new google.maps.Marker({
                position: coord,
                map: $scope.map,
                title: 'Hello World!'
            });
        };
        $scope.initiateMap = function(centerCoords){
            var mapOptions = {
                center: centerCoords,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),mapOptions);
            //Infowindow and Angular compile 
            // var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            // var compiled = $compile(contentString)($scope);
            // var infowindow = new google.maps.InfoWindow({
            //     content: compiled[0]
            // });
            // var marker = new google.maps.Marker({
            //     position: myLatlng,
            //     map: map,
            //     title: 'Your location'
            // });
            // google.maps.event.addListener(marker, 'click', function () {
            //     infowindow.open(map, marker);
            // });
            $scope.map = map;
            $scope.map.setCenter(centerCoords);
            $ionicLoading.hide()
            $scope.addMarker({lat: centerCoords.lat(), lng: centerCoords.lng()}, "icon");
            $scope.fetchCoordinates();
        }
        $scope.centerOnMe = function () {
            $ionicLoading.show()
            var options = {timeout: 3000, enableHighAccuracy: true, maximumAge: 10000};
            navigator.geolocation.getCurrentPosition(function (pos) {
                $scope.currentLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
                $scope.initiateMap($scope.currentLocation);                
            }, function (error) {
                $ionicLoading.hide()                
                navigator.notification.alert(
                    'Unable to get location!',
                    $scope.locationFallback(),         
                    'Location', 
                    'Okay'
                );
            }, options);
        };
        $scope.locationFallback = function(){
            $scope.initiateMap(new google.maps.LatLng(28.6540471,77.1732288));            
        }
        $scope.fetchCoordinates = function(){            
            var vehicleInfo = Parse.Object.extend("vehicleInfo");
            var vehicle = new Parse.Query(vehicleInfo);
            var location = new Parse.GeoPoint($scope.currentLocation.lat(), $scope.currentLocation.lng());
            vehicle.withinKilometers("location", location, 5);
            vehicle.find({
                success: function(objects) {                    
                    console.log("after location");
                    console.log(objects);
                    $scope.locations = [];
                    $.each(objects, function(i,v){
                        $scope.locations.push(new google.maps.LatLng(v.attributes.location._latitude, v.attributes.location._longitude));
                        $scope.addMarker(new google.maps.LatLng(v.attributes.location._latitude, v.attributes.location._longitude))                        
                    })                      
                },
                error: function(error) {
                    console.log("An error occured :(");
                }
            });
        }
        $scope.clickTest = function () {
            alert('Example of infowindow with ng-click')
        };
    });