angular.module("oyedelhi")

    .value('version', '0.1')
    .service("UserService", function ($http) {
        var userObj = {};
        var adminId = 0;
        var roles = [];
        var hospitalObj = {};
        return {
            getAccessToken: function () {
                return JSON.parse(window.localStorage.getItem('user')).accessTokenObj.access_token;
            },
            /**
             * Used to save the user id, after logging in using Facebook.
             * @param id
             */
            setId: function (id) {
                window.localStorage.setItem('userid', id);
                window.localStorage.setItem('loggedin', 'true');
            },
            getId: function () {
                if (window.localStorage.getItem('loggedin') == 'true') {
                    return window.localStorage.getItem('userid');
                }
                else {
                    return null;
                }
            },
            setUserObj: function (obj) {
                window.localStorage.setItem('user', JSON.stringify(obj));
                window.localStorage.setItem('loggedin', 'true');
            },
            getUserObj: function () {
                if (window.localStorage.getItem('loggedin') == 'true') {
                    return JSON.parse(window.localStorage.getItem('user'));
                }
                else {
                    return null;
                }
            },
            destroyUserObj: function () {
                window.localStorage.setItem('user', null);
                window.localStorage.setItem('loggedin', 'false');
            }
        }
    })
    .service("UtilitiesService", function ($http, UserService, $rootScope, $location) {
        var apiUrl = "http://stg-api-bo.mediassistindia.net/";
        var mayaUrl = "http://stg-api-maya.mediassistindia.net/";
        var authUrl = "http://stg-auth.mediassistindia.net/";
        var appUrl = "http://stg-bo.mediassistindia.net/";
        // var appUrl = "http://localhost:8001/"
        var DC_MA_ContractID = "5290";
        var DC_Inv_PmTypeId = "5292";
        var CoverFoxId = "55915";
        var erTypes = [];
        return {
            getUrlPrefix: function (type) {
                switch (type) {
                    case "api":
                        return apiUrl;
                        break;
                    case "app":
                        return appUrl;
                        break;
                    case "maya":
                        return mayaUrl;
                        break;
                    case "auth":
                        return authUrl;
                        break;
                    default:
                        return apiUrl;
                        break;
                }
            },
            formatCurrency: function (inputCurrency) {
                if (inputCurrency) {
                    var neg = false;
                    if (inputCurrency < 0) {
                        neg = true
                    }
                    else {
                        neg = false;
                    }
                    inputCurrency = Math.abs(inputCurrency).toString();
                    var afterPoint = '';
                    if (inputCurrency.indexOf('.') > 0)
                        afterPoint = inputCurrency.substring(inputCurrency.indexOf('.'), inputCurrency.length);
                    inputCurrency = Math.floor(inputCurrency);
                    inputCurrency = inputCurrency.toString();
                    var lastThree = inputCurrency.substring(inputCurrency.length - 3);
                    var otherNumbers = inputCurrency.substring(0, inputCurrency.length - 3);
                    if (otherNumbers != '')
                        lastThree = ',' + lastThree;
                    var res = (neg ? "-" : "") + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
                    return res;
                }
                else {
                    return 0;
                }
            },
            getAge: function (dateOfBirth) {
                var dob = new Date(parseInt(dateOfBirth.replace("/Date(", "").replace(")/", ""), 10))
                var today = new Date();
                var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
                return age;
            },
            formatDate: function (inputDate) {
                var dt = inputDate ? new Date(inputDate) : new Date();
                var now = new Date(Date.now());
                var dtString = dt.getDate() + " " + dt.getMonthName().substring(0, 3) + " " + dt.getFullYear();
                var nowString = now.getDate() + " " + now.getMonthName().substring(0, 3) + " " + now.getFullYear();
                var dispDate = dtString.split(" ");

                if (dtString == nowString) {
                    return "Today";
                }
                // else if (dt.getFullYear() == now.getFullYear()) {
                //     return dispDate[1] + " " + dispDate[0];
                // }
                else {
                    return dispDate[1] + " " + dispDate[0] + " " + dispDate[2];
                }
            },
            formatDateNumber: function (inputDate) {
                inputDate = new Date(parseInt(inputDate.replace("/Date(", "").replace(")/", ""), 10))
                var dt = inputDate ? new Date(inputDate) : new Date();
                var mins = dt.getMinutes().length == 1 ? '0' + dt.getMinutes() : dt.getMinutes();
                var hrs = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
                return dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + hrs + ":" + mins;
            },
            formatTime: function (inputDate) {
                var dt = inputDate ? new Date(inputDate) : new Date();
                var now = new Date(Date.now());
                var dtString = dt.getDate() + " " + dt.getMonthName() + " " + dt.getFullYear();
                var nowString = now.getDate() + " " + now.getMonthName() + " " + now.getFullYear();
                var dispDate = dtString.split(" ");
                var mins = dt.getMinutes().length == 1 ? '0' + dt.getMinutes() : dt.getMinutes();
                var hrs = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
                mins = mins < 10 ? "0" + mins : mins;
                var time = hrs + ":" + mins;
                time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                if (time.length > 1) { // If time format correct
                    time = time.slice(1);  // Remove full string match value
                    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                    time[0] = +time[0] % 12 || 12; // Adjust hours
                }
                return time.join('');
            },
            getAuditDate: function (inputDate) {
                inputDate = new Date(parseInt(inputDate.replace("/Date(", "").replace(")/", ""), 10))
                return this.formatDate(inputDate);
            },
            getAuditTime: function (inputDate) {
                inputDate = new Date(parseInt(inputDate.replace("/Date(", "").replace(")/", ""), 10))
                var dt = inputDate ? new Date(inputDate) : new Date();
                var now = new Date(Date.now());
                var dtString = dt.getDate() + " " + dt.getMonthName() + " " + dt.getFullYear();
                var nowString = now.getDate() + " " + now.getMonthName() + " " + now.getFullYear();
                var dispDate = dtString.split(" ");
                var mins = dt.getMinutes().length == 1 ? '0' + dt.getMinutes() : dt.getMinutes();
                var hrs = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
                mins = mins < 10 ? "0" + mins : mins;
                var time = hrs + ":" + mins;
                time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                if (time.length > 1) { // If time format correct
                    time = time.slice(1);  // Remove full string match value
                    time[5] = +time[0] < 12 ? ' am' : ' pm'; // Set AM/PM
                    time[0] = +time[0] % 12 || 12; // Adjust hours
                }
                return time.join('');
            },
            compareDate: function (inputDate) {
                inputDate = new Date(parseInt(inputDate.replace("/Date(", "").replace(")/", ""), 10))
                var dt = inputDate ? new Date(inputDate) : new Date();
                var now = new Date(Date.now());
                var dtString = dt.getDate() + " " + dt.getMonthName() + " " + dt.getFullYear();
                var nowString = now.getDate() + " " + now.getMonthName() + " " + now.getFullYear();
                var dispDate = dtString.split(" ");

                if (dtString == nowString) {
                    var mins = dt.getMinutes() == '0' ? '00' : dt.getMinutes();
                    var time = dt.getHours() + ":" + mins;
                    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

                    if (time.length > 1) { // If time format correct
                        time = time.slice(1);  // Remove full string match value
                        time[5] = +time[0] < 12 ? ' am' : ' pm'; // Set AM/PM
                        time[0] = +time[0] % 12 || 12; // Adjust hours
                    }
                    // var x = time.join ('');
                    // return "Today"+x;
                    return "Today";
                }
                else if (dt.getFullYear() == now.getFullYear()) {
                    return dispDate[1] + " " + dispDate[0];
                }
                else {
                    return dispDate[1] + " " + dispDate[0] + " " + dispDate[2];
                }
            },
            makeAjaxCalls: function (url, data, method, accessToken) {
                var promise = $http({
                    method: method,
                    url: url,
                    data: data,
                    headers: {
                        "AccessToken": accessToken
                    }
                });
                promise.catch(function (error) {
                    //Checking if the accessToken is invalid and signing the user out of the system!
                    if (error.status == 403 && error.statusText == "Forbidden") {
                        UserService.destroyUserObj();
                        $rootScope.$emit('signout');
                        $location.path("/");
                    }
                })
                return promise;
            },
            addFileInput: function (id) {
                var suffix = Math.floor((Math.random() * 100) + 1);
                $("#" + id).append('<br><input type="file" name="files' + suffix + '" id="">');
            }
        }
    })
    .service("signupService", function ($q, $cordovaFacebook, $log, $cordovaToast, $ionicLoading) {
        return {
            fbSignUp: fbSignUp,
            logOut: logOut
        };

        function logOut() {
            return Parse.User.logOut();
        }

        function facebookAuth(userData) {
            if (userData.status === "connected") {
                var expDate = new Date(
                    new Date().getTime() + userData.authResponse.expiresIn * 1000
                ).toISOString();

                var authData = {
                    id: String(userData.authResponse.userID),
                    access_token: userData.authResponse.accessToken,
                    expiration_date: expDate
                };
                return $q.resolve(authData);
            }

            else {
                return $q.reject("Error");
            }
        }

        function loginUser(authData) {
            return Parse.FacebookUtils.logIn(authData);
        }

        function getUserProfileData(userData) {
            return $cordovaFacebook.api("me?fields=name,id,age_range,gender,friends,picture.width(200).height(200),email", ["public_profile", "user_friends", "email"]);
        }

        function storeUserData(profileData) {
            var user = Parse.User.current();
            return user.save({
                "name": profileData.name,
                "email": profileData.email,
                "avatar": profileData.picture.data.url,
                "age": profileData.age_range.min,
                "gender": profileData.gender,
                "friends": {
                    "data": profileData.friends.data,
                    "summary": profileData.friends.summary.total_count
                }
            });

        }

        function facebookErr(err) {
            $log.error(err);
            $cordovaToast
                .show("Unable to login! Clear data & try again after some time", 'long', 'center')
                .then(function (success) {
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.hide();
                });
            $ionicLoading.hide();
            return $q.reject(err);
        }

        function fbSignUp() {
            return $cordovaFacebook.login(["public_profile", "user_friends", "email"])
                .then(facebookAuth)
                .then(loginUser)
                .then(getUserProfileData)
                .then(storeUserData)
                .catch(facebookErr);

        }
    });

    
