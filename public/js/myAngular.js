(function() {
  var app = angular.module('app', []);

  app.controller('UserController', function(){
    this.user = user1;
  });
    var user1 = {
      firstname: "fabien",
      lastname: "turgut",
    }

    app.controller("ConnectionCtrl", function(){
      this.connection = {
        mailadress: "fabazad@live.fr",
        password: "K2vm@0r67",
      };
      this.connection(connection){
        this.connection = {};
      };

    });

})();
