(function() {
  var app = angular.module('app', []);

    app.controller("ConnectionCtrl", ["$http", function($http){
      this.connection = {};
      this.getConnection = function(){
        alert(this.connection.password);

        /*$http.put('/connection', { param: this.connection }).success(function(data){
          alert(data);
        });*/

        this.connection = {};
      };
    }]);

    app.controller("InscriptionCtrl", function(){
      this.inscription = {};
      this.getInscription = function(inscription){
        alert(this.inscription.password);
        this.inscription = {};
      };
    });

    app.controller("HomeCtrl", function(){

    });

})();
