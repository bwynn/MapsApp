var app = angular.module('meanMapApp', ['AddCtrl', 'QueryCtrl', 'geolocation', 'Gservice', 'ngRoute'])
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
        controller: 'queryCtrl',
        templateUrl: 'partials/queryForm.html',
      })
      .otherwise({
        redirectTo: '/join'
      })
  });
