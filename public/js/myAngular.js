(function() {
  //var app = angular.module('app', []);
  var app = angular.module('app', ['ngCookies'], function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for(name in obj) {
    value = obj[name];
    if(value instanceof Array) {
      for(i=0; i<value.length; ++i) {
        subValue = value[i];
        fullSubName = name + '[' + i + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += param(innerObj) + '&';
      }
    }
    else if(value instanceof Object) {
      for(subName in value) {
        subValue = value[subName];
        fullSubName = name + '[' + subName + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += param(innerObj) + '&';
      }
    }
    else if(value !== undefined && value !== null)
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
    return query.length ? query.substr(0, query.length - 1) : query;
    };
    $httpProvider.defaults.transformRequest = [function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
  });


/*Controllers*/

  app.controller("UserCtrl", ["$http", "$cookies", function($http, $cookies){
    this.connection = {};
    this.inscription = {};
    this.editPassword = {};
    var userCtrl = this;
    var cookie = {cookiecode : $cookies.get('cookiecode')};

    if(cookie.cookiecode){
      this.chargement = true;
      $http.post('/connectionCookie', cookie)
      .then(function(response){
        userCtrl.chargement = false;
        if("error" in response.data){
          alert(response.data.error);
        }
        else {
          userCtrl.user = response.data;
          Materialize.toast("Connecté.", 10000);
        }
      });
    }

    this.connected = function(){
      return("user" in this);
    }

    this.deconnection = function(){
      delete this.user;
      this.connection = {};
      this.inscription = {};
      $cookies.remove("cookiecode");
      Materialize.toast("Déconnecté.", 3000);
    }

    this.getConnection = function(){
      this.chargement = true;
      $http.post('/connection', this.connection).then(function(response){
        userCtrl.chargement = false;
        userCtrl.connection = {};
        if("error" in response.data){
          Materialize.toast(response.data.error, 3000);
        }
        else {
          userCtrl.user = response.data;
          if(response.data.stayconnected){
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDay() - 7);
            $cookies.put('cookiecode', response.data.cookiecode, {"expires" : expireDate} );
            Materialize.toast("Connecté.", 3000);
          }
          else {
            var expireDate = new Date();
            expireDate.setMinutes(expireDate.getMinutes() + 20);
            $cookies.put('cookiecode', response.data.cookiecode, {"expires" : expireDate} );
            Materialize.toast("Connecté.", 3000);
          }
        }
      });
    };

    this.getInscription = function(inscription){
      this.chargement = true;
      $http.post('/inscription', this.inscription).then(function(response){
        userCtrl.chargement = false;
        userCtrl.inscription = {};
        if("error" in response.data){
          Materialize.toast(response.data.error, 3000);
        }
        else {
          userCtrl.user = response.data;
          var expireDate = new Date();
          expireDate.setMinutes(expireDate.getMinutes() + 20);
          $cookies.put('cookiecode', response.data.cookiecode, {"expires" : expireDate });
          Materialize.toast("Inscrit.", 3000);
        }
      });
    };

    this.editPassword = function(){
      this.chargement = true;
      var params = this.editpassword;
      params.id_user = this.user.id_user;
      $http.post('/editPassword', params).then(function(response){
        userCtrl.chargement = false;
        userCtrl.editpassword = {};
        if("error" in response.data){
          Materialize.toast(response.data.error, 2000);
        }
        else {
          Materialize.toast("Mot de passe modifié.", 3000);
        }
      });
    };
  }]);


})();
