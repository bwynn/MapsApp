angular.module('Gservice', [])
  .factory('gservice', function($rootScope, $http) {
    // initialize variables
    // =========================================================================
    // service our factory will return
    var googleMapService = {};

    // array of locations obtained from API calls
    var locations = [];

    // selected location (init to the center of US)
    var selectedLat = 39.50;
    var selectedLong = -98.35;

    // Handling Clicks and location selection
    googleMapService.clickLat  = 0;
    googleMapService.clickLong = 0;

    // Functions
    // =========================================================================
    // Refresh the map with new data. function will take new lat and long coords
    googleMapService.refresh = function(latitude, longitude) {
      // clears the holding array of locations
      locations = [];

      // set the selecceted lang and long equal to the ones provided on the refresh() call
      selectedLat = latitude;
      selectedLong = longitude;

      // perform and ajax call to get all of the records in teh db
      $http.get('/users').success(function(response) {

        // convert the result into Google Map Format
        locations = convertToMapPoints(response);

        // then initialize the map
        initialize(latitude, longitude);
      }).error(function() {});
    };

    // Private inner functions
    // =========================================================================
    // convert a JSON of users into map points
    var convertToMapPoints = function(response) {

      // clear the locations array
      locations = [];

      // loop through all of the JSON entries provided in the response
      for (var i = 0; i < response.length; i++) {
        var user = response[i];

        var contentString =
          '<p><b>Username</b>: ' + user.username +
          '<br><b>Age</b>: ' + user.age +
          '<br><b>Gender</b>: ' + user.gender +
          '<br><b>Favorite Language</b>: ' + user.favlang +
          '</p>';

        // converts each of teh JSON objects into Google Maps Location format (Note [Lat, Lng] format).
        locations.push({
          latlon: new google.maps.LatLng(user.location[1], user.location[0]),
          message: new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 320
          }),
          username: user.username,
          gender: user.gender,
          age: user.age,
          favlang: user.favlang
        });
      }
      // location is now an array populated with records in Google Maps format
      return locations;
    };

    // Initializes teh app
    var initialize = function(latitude, longitude) {

      // uses the selected lat, long as starting point
      var myLatLng = {lat: selectedLat, lng: selectedLong};

      // if map has not been created already
      if (!map) {
        // create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: myLatLng
        });
      }

      // loop through each location in the array and place a marker
      locations.forEach(function(n, i) {
        var marker = new google.maps.Marker({
          position: n.latlon,
          map: map,
          title: 'Big Map',
          icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        // for each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e) {

          // when clicked, open the selected markers message
          currentSelectedMarker = n;
          n.message.open(map, marker);
        });
      });

      // set initial location as a bouncing red marker
      var initialLocation = new google.maps.LatLng(latitude, longitude);
      var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });

      // function for moving to a selected location
      map.panTo(new google.maps.LatLng(latitude, longitude));

      lastMarker = marker;

      // clicking on the Map moves the bouncing red marker
      google.maps.event.addListener(map, 'click', function(e) {
        var marker = new google.maps.Marker({
          position: e.latLng,
          animation: google.maps.Animation.BOUNCE,
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // when a new spot is selected, delete the old red bouncing marker
        if (lastMarker) {
          lastMarker.setMap(null);
        }
        // create a new red bouncing marker and move to it.
        lastMarker = marker;
        map.panTo(marker.position);

        // handling clicks and location selection
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast('clicked');
      });
    };

    // refresh the page upon window load. Use the initial latitude and longitude
    google.maps.event.addDomListener(window, 'load',
      googleMapService.refresh(selectedLat, selectedLong));

    return googleMapService;
  });
