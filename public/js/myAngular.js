(function() {
  var app = angular.module('app', []);

  app.controller('UserController', function(){
    this.user = user1;
  });
    var user1 = {
      firstname: "fabien",
      lastname: "turgut",
    }
})();
