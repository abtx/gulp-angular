var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider.when("/",
    {
      templateUrl: "views/app.html",
      controller: "AppCtrl",
      controllerAs: "app"
    }
  )
  .otherwise({
    template: "This route isn't set!"
  });
});

app.controller('AppCtrl', function() {
  var self = this;
  self.message = "The app routing is working!!!";
});
