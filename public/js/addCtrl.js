angular.module('AddCtrl', ['geolocation', 'Gservice'])
  .controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice) {
    // intialized variables
    // =========================================================================
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // set initial coordinates for the center of teh US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    // Functions
    // =========================================================================
    // Get coordinates based on mouse click. When a click event is detected...
    $rootScope.$on("clicked", function() {
      // run the gservice functions associated with identifying coordinates
      $scope.$apply(function() {
        $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
        $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        $scope.formData.htmlverified = "Nope (thanks for spamming my map...)";
      });
    });

    $scope.createUser = function() {
      // grabs all text box fields
      var userData = {
        username: $scope.formData.username,
        gender: $scope.formData.gender,
        age: $scope.formData.age,
        favlang: $scope.formData.favlang,
        location: [$scope.formData.longitude, $scope.formData.latitude],
        htmlverified: $scope.formData.htmlverified
      };

      // saves user data to the db
      $http.post('/users', userData)
        .success(function(data) {
          // once complete, clear the form (except location)
          $scope.formData.username = "";
          $scope.formData.gender = "";
          $scope.formData.age = "";
          $scope.formData.favlang = "";
          // refresh the map with new data
          gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
        })
        .error(function(data) {
          console.log("Error: " + data);
        });
    };
  });
