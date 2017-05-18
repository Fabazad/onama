(function() {
  var app = angular.module('users', []);

  app.controller('ReviewController', function(){
    this.review = {
      firstname: "fabien",
      lastname: "turgut"
    };
  });

});
