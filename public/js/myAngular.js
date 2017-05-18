(function() {
  var app = angular.module('app', []);

    app.controller("ConnectionCtrl", ["$http", function($http){
      this.connection = {};
      this.getConnection = function(){
        alert(this.connection.password);

        $http.get('/connection').then(function(data){
          alert(JSON.parse(data).name);
        });

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
