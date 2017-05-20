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
  if($cookies.get('codecookie')){
    $http.post('/connectionCookie', {codecookie : $cookies.get('codecookie')})
    .then(function(response){
      /*if("error" in response.data){
        alert(response.data.error);
      }*/
    });
  }

  var userCtrl = this;

  this.connected = function(){
    return("user" in this);
  }

  this.deconnection = function(){
    delete this.user;
    this.connection = {};
    this.inscription = {};
    $cookies.remove("codecookie");
  }

  this.getConnection = function(){
    $http.post('/connection', this.connection).then(function(response){
      if("error" in response.data){
        alert(response.data.error);
      }
      else {
        userCtrl.user = response.data;
        if(response.data.stayconnected){
          var expireDate = new Date();
          expireDate.setDate(expireDate.getDay() - 7);
          alert(expireDate);
          $cookies.put('codecookie', response.data.cookiecode, {"expires" : expireDate} );
        }
        else {
          var expireDate = new Date();
          expireDate.setMinutes(expireDate.getMinutes() + 20);
          $cookies.put('codecookie', response.data.cookiecode, {"expires" : expireDate} );
        }
      }
      this.connection = {};
    });
  };


  this.getInscription = function(inscription){
    $http.post('/inscription', this.inscription).then(function(response){
      if("error" in response.data){
        alert(response.data.error);
      }
      else {
        userCtrl.user = response.data;
        var expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() + 20);
        $cookies.put('codecookie', response.data.cookiecode, {"expires" : expireDate });
      }
      this.inscription = {};
    });
  };
}]);


app.directive('nav-onama', function(){
  return {
    restrict: 'E',
    templateUrl: 'http://localhost:5000/partials'
  };
});

})();
