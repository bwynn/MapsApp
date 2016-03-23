angular.module('AddCtrl', ['geolocation'])
  .controller('addCtrl', function($scope, $http, geolocation) {
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
        })
        .error(function(data) {
          console.log("Error: " + data);
        });
    };
  });
