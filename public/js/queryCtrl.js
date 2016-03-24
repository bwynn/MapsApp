// queryCtrl.js
angular.module('QueryCtrl', ['geolocation', 'Gservice'])
  .controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice) {

    // initializes vars
    // =========================================================================
    $scope.formData = {};
    var queryBody = {};

    // Functions
    // =========================================================================

    // get users actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data) {

      coords = {lat: data.coords.latitude, long: data.coords.longitude};

      // set the lat and long equal to the HTML5 coords
      $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
      $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
    });

    // get coords based on mouse click. when a click event is detected....
    $rootScope.$on('clicked', function() {
      // run the gservice functions associated with identifying coordinates
      $scope.$apply(function() {
        $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
        $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
      });
    });

    // take query params and incorporate into a JSON queryBody
    $scope.queryUsers = function() {

      // assemble the query body
      queryBody = {
        longitude: parseFloat($scope.formData.longitude),
        latitude: parseFloat($scope.formData.latitude),
        distance: parseFloat($scope.formData.distance),
        male: $scope.formData.male,
        female: $scope.formData.female,
        other: $scope.formData.other,
        minAge: $scope.formData.minage,
        maxAge: $scope.formData.maxage,
        favlang: $scope.formData.favlang,
        reqVerified: $scope.formData.verified
      };

      // post the queryBody to the /query POST route to retrieve the filtered results
      $http.post('/query', queryBody)
        // store filtered results in queryResults
        .success(function(queryResults) {

          // pass the filtered results to the google map service and refresh the map
          gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

          // count the number of records retrieved for the panel-footer
          $scope.queryCount = queryResults.length;
        })
        .error(function(queryResults) {
          console.log('Error ' + queryResults);
        });
    };
  });
