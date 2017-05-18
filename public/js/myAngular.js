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
        alert(connexion.password);
        this.connection = {};
      };
    });

    app.controller("InscriptionCtrl", function(){
      this.inscription = {};
      this.getInscription = function(inscription){
        alert(inscription.password);
        this.inscription = {};
      };
    });

    app.controller("HomeCtrl", function(){

    });

})();
