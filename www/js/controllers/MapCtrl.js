/**
 * Created by pradyumnad on 12/19/15.
 */
angular.module("oyedelhi")
    .controller('MapCtrl', function ($scope, $ionicLoading, $compile) {
        $scope.init = function () {
            var myLatlng = new google.maps.LatLng(12.9272442,77.6660118);
            var mapOptions = {
                center: myLatlng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),mapOptions);
            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($scope);
            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Cinemax Bellandur'
            });
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
            $scope.map = map;
            $scope.fetchCoordinates();
        };
        $scope.addMarker = function (coord) {
            var marker = new google.maps.Marker({
                position: coord,
                map: $scope.map,
                title: 'Hello World!'
            });
        };
        $scope.centerOnMe = function () {
            if (!$scope.map) {
                return;
            }
            $ionicLoading.show()
            var options = {timeout: 3000, enableHighAccuracy: true, maximumAge: 10000};
            navigator.geolocation.getCurrentPosition(function (pos) {
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                console.log(pos);
                alert(JSON.stringify(pos));
                $ionicLoading.hide()

                $scope.addMarker({lat: pos.coords.latitude, lng: pos.coords.longitude});

            }, function (error) {
                $ionicLoading.hide()                
                alert('Unable to get location: ' + error.message);
            }, options);
        };
        $scope.fetchCoordinates = function(){
            var vehicleInfo = Parse.Object.extend("vehicleInfo");
            var vehicle = new Parse.Query(vehicleInfo);
            var location = new Parse.GeoPoint($scope.map.getCenter().lat(), $scope.map.getCenter().lng());
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