(function() {
  var app = angular.module('app', []);

  app.controller('UserCtrl', function(){
    this.user = user;
  });
    var user = {
      firstname: "fabien",
      lastname: "turgut"
    };
})();
