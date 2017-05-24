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
    this.user = {};
    this.food = {};
    var userCtrl = this;

    //recuperation des aliments de l'user
    this.getFood = function(id_user){
      $http.get('/user/myfood',{params: {id_user: id_user}})
      .then(function(response){
        userCtrl.food = response.data;
        Materialize.toast("Connecté.", 3000);
      });
    }

    //Initialiser le cookie stayconnected
    this.initStayConnected = function(data){
      if(data.stayconnected){ //Cookie 7 jours
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);
        $cookies.put('cookiecode', data.cookiecode, {"expires" : expireDate} );
      }
      else { //Cookie 20min
        var expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() + 20);
        $cookies.put('cookiecode', data.cookiecode, {"expires" : expireDate} );
      }
    }

    //Connection si cookie stayconnected
    var cookie = {cookiecode : $cookies.get('cookiecode')};
    if(cookie.cookiecode){
      this.chargement = true;
      $http.post('/connectionCookie', cookie)
      .then(function(response){
        userCtrl.chargement = false;
        if("error" in response.data){
          Materialize.toast(response.data.error, 3000);
        }
        else {
          userCtrl.user = response.data;
          userCtrl.initStayConnected(response.data);
          userCtrl.getFood(userCtrl.user.id_user);
        }
      });
    }

    //Indique si un utilisateur est connecté
    this.connected = function(){
      return('id_user' in this.user);
    }

    //deconnection de l'utilisateur
    this.deconnection = function(){
      this.connection = {};
      this.inscription = {};
      this.editPassword = {};
      this.user = {};
      this.food = {};
      $cookies.remove("cookiecode");
      Materialize.toast("Déconnecté.", 3000);
    }

    // Connection
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
          userCtrl.initStayConnected(response.data);
          userCtrl.getFood(userCtrl.user.id_user);
        }
      });
    };

    //Inscription
    this.getInscription = function(inscription){
      this.chargement = true;
      $http.post('/inscription', this.inscription).then(function(response){
        userCtrl.chargement = false;
        userCtrl.inscription = {};
        if("error" in response.data){
          Materialize.toast(response.data.error, 3000);
        }
        else {
          Materialize.toast("Inscrit.", 3000);
        }
      });
    };

    //Changer le mot de passe
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

    //Obtenir la quantite d'un aliment
    this.getQuantity = function(id_food){
      var res = 0;
      for(var i = 0; i < this.food.length; i++){
        if(this.food[i].id_food == id_food){
          res = this.food[i].quantity_getfood;
        }
      }
      return res;
    }

    //Obtenir la quantite en fonction de l'id
    this.setQuantity = function(id_food, quantity, title_food){
      var find = false;
      for(var i =0; i < this.food.length; i++){
        if(this.food[i].id_food == id_food){
          this.food[i].quantity_getfood = quantity;
          find = true;
        }
      }
      if(!find){
        this.food.push({id_food: id_food, quantity_getfood: quantity, title_food: title_food});
      }
    }

    //Supprimer aliment
    this.deleteFood = function(id_food){
      for(var i = 0; i < this.food.length; i++){
        if(this.food[i].id_food == id_food){
          this.food.splice(i, 1);
        }
      }
    }

    //Modifier quantite d'aliment
    this.updateQuantityFood = function(id_food, action, modalValue, title_food){

      var actualQuantity = this.getQuantity(id_food);
      var id_user = userCtrl.user.id_user;

      switch (action){
        case "Ajouter":
          var newValue = parseInt(actualQuantity) + parseInt(modalValue);
          this.setQuantity(id_food, newValue, title_food);
          if(actualQuantity == 0){
            $http.post("user/addFood", {id_user: id_user, id_food: id_food, quantity_getfood: newValue});
          }
          else{
            var data = {id_user: id_user, id_food: id_food, quantity_getfood: newValue};
            $http.put("user/setFood", {}, {params: data}).then(function(response){
            });
          }
          break;

        case "Enlever":
          var newValue = actualQuantity - modalValue;
          if(newValue == 0){
            this.deleteFood(id_food);
            $http.delete("user/delFood", {params: {id_user: id_user, id_food: id_food}});
          }
          else if(newValue > 0){
            this.setQuantity(id_food, newValue);
            var data = {id_user: id_user, id_food: id_food, quantity_getfood: newValue};
            $http.put("user/setFood", {}, {params: data});
          }
          else{
            Materialize.toast("Erreur : valeur finale négative.");
          }
          break;

        case "Initialiser":
          var newValue = modalValue;
          this.setQuantity(id_food, newValue, title_food);
          if(actualQuantity == 0)
          {
            $http.post("user/addFood", {id_user: id_user, id_food: id_food, quantity_getfood: newValue});
          }
          else{
            $http.put("user/setFood",{}, {params:{id_user: id_user, id_food: id_food, quantity_getfood: newValue}});
          }
          break;

        case "Delete":
          var newValue = actualQuantity - modalValue;
          this.deleteFood(id_food);
          $http.delete("user/delFood", {params: {id_user: id_user, id_food: id_food}});
          break;
      }
    }

    this.newPassword = function(mailAdress){
      Materialize.toast(mailAdress,3000);
      $http.put("user/newPassword", {}, {params:{mailadress: mailAdress}})
      .then(function(response){
        if("error" in response.data){
          Materialize.toast(response.data.error, 2000);
        }
        else{
          Materialize.toast("Un mail a été envoyé à " + response.data.mailadress + ".", 2000);
        }
      });
    }

  }]);


  app.controller("MyFoodCtrl",["$http", function($http){
    this.food = {};
    this.modal = {};
    var myFoodCtrl = this;

    $http.get('/food/all')
    .then(function(response){
      if("error" in response.data){
        alert(response.data.error);
      }
      else {
        myFoodCtrl.food = response.data;
        var data = {};
        var setField = function(element){
          data[element.title_food] = null;
        }
        response.data.forEach(setField);
        $('#autocompleteMyFood').autocomplete({
          data: data,
          limit: 10, // The max amount of results that can be shown at once. Default: Infinity.
          onAutocomplete: function(val) {
            //
          },
          minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
        });
      }
    });

    //Initialiser la fenetre modal
    this.findTitle_food = function(id_food){
      for(var i = 0; i < this.food.length; i++){
        if(this.food[i].id_food == id_food){
          return this.food[i].title_food;
        }
      }
      return "";
    }
    this.setModalAdd = function(id){
      this.modal.id_food = id;
      this.modal.action = "Ajouter";
      this.modal.title_food = this.findTitle_food(id);
      this.modal.max = "";
    }
    this.setModalSub = function(id, q){
      this.modal.id_food = id;
      this.modal.action = "Enlever";
      this.modal.title_food = this.findTitle_food(id);
      this.modal.max = q;
    }
    this.setModalNew = function(id){
      this.modal.id_food = id;
      this.modal.action = "Initialiser";
      this.modal.title_food = this.findTitle_food(id);
      this.modal.max = "";
    }

    this.existingFood = function(){
      var existing = 0;
      for(var i = 0; i < this.food.length; i++){
        if(this.food[i].title_food == this.myFoodAutocomplete){
          existing = this.food[i].id_food;
        }
      }
      return existing;
    }

  }]);


  app.controller("FoodCtrl",["$http", function($http){
    this.food = {};
    this.foodrow1 = {};
    this.foodrow2 = {};
    this.page = 0;
    this.totalPage = [];

    var foodCtrl = this;


    $http.get('/food/all')
    .then(function(response){
      if("error" in response.data){
        alert(response.data.error);
      }
      else {
        foodCtrl.food = response.data;
        for(var i = 0 ; i <= Math.trunc(response.data.length/50); i++){
          foodCtrl.totalPage.push(i + 1);
        }
        foodCtrl.changePage(1);
        var data = {};

        var setField = function(element){
          data[element.title_food] = null;
        }
        response.data.forEach(setField);
        $('#autocompleteFood').autocomplete({
          data: data,
          limit: 10, // The max amount of results that can be shown at once. Default: Infinity.
          onAutocomplete: function(val) {
              var index = -1;
              for(var i = 0; i < foodCtrl.food.length; i++){
                if(foodCtrl.food[i].title_food.replace(/ /g, "").toLowerCase() == val.replace(/ /g, "").toLowerCase()){
                  index = i;
                }
              }
              if(index == -1){
                Materialize.toast("Erreur.", 3000);
              }
              else {
                //foodCtrl.changePage(Math.trunc(index/50) + 1);
                Materialize.toast("Page : " + (Math.trunc(index/50) + 1) + " aliment : " + (index%50 + 1), 3000);
              }
          },
          minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
        });
      }
    });


    this.changePage = function(numpage){
      if(numpage > 0 && numpage <= this.totalPage.length){
        this.page = numpage;
        this.foodrow1 = this.food.slice((this.page-1)*50, (this.page-1)*50 + 25);
        this.foodrow2 = this.food.slice((this.page-1)*50+25, (this.page-1)*50 + 50);
      }
    }

    this.activePage = function(i){
      return (i == this.page ? "active" : "");
    }

    this.previousPage = function(){
      this.changePage(this.page - 1);
    }
    this.nextPage = function(){
        this.changePage(this.page + 1);
    }

    this.disableLeft = function(){
      return(this.page == 1 ? "disabled" :"");
      alert("test");
    }
    this.disableRight = function(){
      return(this.page == this.totalPage.length ? "disabled" : "");
    }

  }]);


  app.controller("RecipesCtrl",["$http", function($http){
    this.recipes = {};
    var recipesCtrl = this;

    $http.get("/recipes/getAll")
    .then(function(response){
      recipesCtrl.recipes = response.data;
    })
  }]);
})();
