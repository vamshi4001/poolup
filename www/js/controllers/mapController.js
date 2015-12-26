/**
 * Created by pradyumnad on 12/19/15.
 */
angular.module("oyedelhi")
    .controller('mapController', function ($scope, $ionicLoading, $compile, $cordovaToast, RequestService) {
        $scope.currentLocation = null;
        var meimg = "img/me.png";
        var carsimg = "img/car.png";
        var oldMarkers = [];

        function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }

        $scope.contactUser = function (data) {
            console.log(data);
        };
        $scope.addCarMarker = function (attributes, icon) {
            var coord = new google.maps.LatLng(attributes.source._latitude, attributes.source._longitude);
            var marker = new google.maps.Marker({
                position: coord,
                map: $scope.map,
                title: 'Hello World!',
                icon: carsimg
            });
            var User = Parse.Object.extend("User");
            var query = new Parse.Query(User);
            query.equalTo("objectId", attributes.userid);
            query.first({
                success: function (user) {
                    var vehicleData = clone(attributes);
                    var userData = clone(user.attributes);
                    userData.id = user.id;
                    vehicleData.user = userData;
                    $scope.locations.push(vehicleData);
                    var contentString =
                        "<div id='content'>" +
                        "<div id='bodyContent'>" +
                        "<img src='" + user.attributes.avatar + "' width='42' height='42' ng-click='clickTest()'>" +
                        "<p>" + user.attributes.name + "</p>" +
                            //"<a ng-click='requestRide('+user.attributes+')'>Click me!</a>" +
                        "</div>" +
                        "</div>";
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        zIndex: 1000
                    });
                    marker.addListener('click', function () {
                        infowindow.open($scope.map, marker);
                    });
                    oldMarkers.push(marker);
                },
                error: function (object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                    console.log(error);
                }
            });
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
            google.maps.event.addListener($scope.map, 'dragend', function () {
                // prevCenter.setMap(null);
                var center = $scope.map.getCenter();
                $scope.map.setCenter(center);
                google.maps.event.trigger($scope.map, 'resize');
                $scope.map.setZoom($scope.map.getZoom());
                // $scope.addMeMarker(center);
                $scope.currentLocation = center;
                $scope.fetchCoordinates();
            });
            $ionicLoading.hide();
            // $scope.addMeMarker({lat: centerCoords.lat(), lng: centerCoords.lng()}, "icon");
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
                    ['Settings', 'No']     // buttonLabels
                );
            }, options);
        };
        function onConfirm(buttonIndex) {
            if (buttonIndex == 1) {
                setTimeout($scope.openLocationSettings(), 3000);
            }
            else {
                $cordovaToast
                    .show("Can't fetch location! Setting to defaults", 'long', 'center')
                    .then(function (success) {}, function (error) {});
                $scope.initiateMap(new google.maps.LatLng(28.6540471, 77.1732288));
            }
        }

        document.addEventListener("resume", onResume, false);
        function onResume() {
            console.log("forground aa gaya");
            $scope.centerOnMe();
        }

        function successCallback() {
            console.log("opened settings");
        }

        function errorCallback() {
            $cordovaToast
                .show("Uh Oh! Something went wrong with settings", 'long', 'center')
                .then(function (success) {
                }, function (error) {
                });
        }

        $scope.openLocationSettings = function () {
            if (typeof cordova.plugins.settings.openSetting != undefined)
                cordova.plugins.settings.openSetting("location_source", successCallback, errorCallback);
        };
        $scope.fetchCoordinates = function () {
            $ionicLoading.show();
            if (oldMarkers && oldMarkers.length !== 0) {
                for (var i = 0; i < oldMarkers.length; i++) {
                    oldMarkers[i].setMap(null);
                }
                oldMarkers = [];
            }
            var vehicleInfo = Parse.Object.extend("vehicleInfo");
            var vehicle = new Parse.Query(vehicleInfo);
            var location = new Parse.GeoPoint($scope.currentLocation.lat(), $scope.currentLocation.lng());
            vehicle.withinKilometers("source", location, 5);
            vehicle.equalTo("enable", true);
            vehicle.find({
                success: function (objects) {
                    $scope.locations = [];
                    if (objects.length > 0) {
                        $cordovaToast
                            .show(objects.length + " car" + (objects.length == 1 ? '' : 's') + " found!", 'long', 'bottom')
                            .then(function (success) {
                            }, function (error) {
                            });
                        $.each(objects, function (i, v) {
                            $scope.addCarMarker(v.attributes)
                        })
                    }
                    else {
                        $cordovaToast
                            .show("No cars available around you & try again after some time", 'long', 'bottom')
                            .then(function (success) {
                            }, function (error) {
                            });
                    }
                    $ionicLoading.hide();
                },
                error: function (error) {
                    console.log("An error occured :(");
                }
            });
        };

        $scope.requestRide = function (user) {
            RequestService.create(user);
        };

        $scope.clickTest = function () {
            alert('Example of infowindow with ng-click')
        };
    });