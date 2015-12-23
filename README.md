# OyeDelhi #

## Plugins ##
* cordova-plugin-whitelist 1.2.0 "Whitelist"
* ionic-plugin-keyboard 1.0.8 "Keyboard"

* cordova-plugin-geolocation 1.0.1 "Geolocation"
* phonegap-facebook-plugin 0.12.0 "Facebook Connect"

* cordova-plugin-x-toast 2.3.1 "Toast"
* cordova-plugin-dialogs 1.2.0 "Notification"

* https://github.com/selahssea/Cordova-open-native-settings


Flow

Signup->Enroll->Explore

**Enroll**

* Phone, Numberplate, From, To, Timings
* Edit details
* Show your car for pooling (show on map or not).

**Explore**
* Fetch user location using Geolocation
* If timeout and failed to get location - show alert using cordovaDialogs
* If settings is clicked - open location setting using cordovaSettings
* Once settings is done, event listener is added to run when app is active again
* This will get location and fetch cars around you in radius of 5kms and enable=true
* Show these markers on map and also the results in normal list view in Browse tab. Contact details are not exposed - Just the name and distance from you.

**Request - Response - Accept**
* user can click on a car-marker and send a "Ride-Request"
* recipient will get it in his bucket (later notification).
* recipient can either ignore or can respond.
* respond is sending another message as a reply - may be asking more information and route - this can involve multiple messages till both agree. Show accept on top while in this status
* Once recipient feels comfortable and willing to allow ride - he clicks on accept to "Accept-Ride" status
* Now the contact details will be visible to each other and they can continue.