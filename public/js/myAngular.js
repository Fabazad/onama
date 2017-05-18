(function() {
  var app = angular.module('app', []);

  app.controller('UserCtrl', function(){
    this.user = {
      firstname: "fabien",
      lastname: "turgut"
    };
  });

})();
