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
      this.connection = {};
      this.getConnection = function(connexion){
        this.connection = {};
        alert(connexion.password);
      };
    });

    app.controller("InscriptionCtrl", function(){

    });

    app.controller("HomeCtrl", function(){

    });

})();
