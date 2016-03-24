var app = angular.module('meanMapApp', ['AddCtrl', 'geolocation', 'Gservice', 'ngRoute'])
  // Configures angualr routing -- showing the relevant view and controller when needed
  // consider moving this into it's own module
  .config(function($routeProvider){
    // Join Team Control Panel
    $routeProvider
      .when('/join', {
        controller: 'addCtrl',
        templateUrl: 'partials/addForm.html',
      })
      .when('/find', {
        templateUrl: 'partials/queryForm.html',
      })
      .otherwise({
        redirectTo: '/join'
      })
  });
