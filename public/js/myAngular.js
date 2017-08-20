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

  var chargement = false;
  var user = {};
  var food = {};
  var recipes = [];
  var recipe = {};
  var types = {};
  var difficulties = {};
  var origins = {};

  //Verifie si l'aliment et renvoie l'id
  var existingFood = function(title_food){
    var existing = 0;
    for(var i = 0; i < food.length; i++){
      if(food[i].title_food == title_food){
        existing = food[i].id_food;
      }
    }
    return existing;
  }



  //Obtenir la quantite d'un aliment
  var getQuantity = function(id_food){
    var res = 0;
    for(var i = 0; i < user.food.length; i++){
      if(user.food[i].id_food == id_food){
        res = user.food[i].quantity_getfood;
      }
    }
    return res;
  }

  //recuperation des aliments de l'user
  var getFood = function(id_user, $http){
    $http.get('/user/myfood',{params: {id_user: id_user}})
    .then(function(response){
      user.food = response.data;

    });
  }

  //Recuperation des recettes de l'utilisateur
  var getRecipes = function(id_user, $http){
    $http.get('/user/myRecipes',{params: {id_user: id_user}})
    .then(function(response){
      user.recipes = response.data;
    });
  }

  //Initialiser le cookie stayconnected
  var initStayConnected = function(data, $cookies){
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

  //trouver le nom d'un aliment
  var findTitle_food = function(id_food){
    for(var i = 0; i < food.length; i++){
      if(food[i].id_food == id_food){
        return food[i].title_food;
      }
    }
    return "";
  }

  //Supprimer aliment de chez l'ulisateur
  var deleteFood = function(id_food){
    for(var i = 0; i < user.food.length; i++){
      if(user.food[i].id_food == id_food){
        user.food.splice(i, 1);
      }
    }
  }


  /*Controllers*/

  app.controller("PageCtrl",["$http", '$cookies', function($http, $cookies){

    this.chargement = function(){
      return chargement;
    }
    this.connected = function(){
      return('id_user' in user);
    }

    //Connection si cookie stayconnected
    this.cookie = {cookiecode : $cookies.get('cookiecode')};
    if(this.cookie.cookiecode){
      chargement = true;
      $http.post('/connectionCookie', this.cookie)
      .then(function(response){
        chargement = false;
        Materialize.toast("Connecté.", 3000);
        if("error" in response.data){
          Materialize.toast(response.data.error, 3000);
        }
        else {
          user = response.data;
          initStayConnected(response.data, $cookies);
          getFood(user.id_user, $http);
          getRecipes(user.id_user, $http);
        }
      });
    }

    //recupere tout les aliments
   $http.get('/food/all')
    .then(function(response){
      if("error" in response.data){
        Materialize.toast(response.data.error, 2000);
      }
      else {
        food = response.data;
        var data = {};
        var setField = function(element){
          data[element.title_food] = null;
        }
        response.data.forEach(setField);
        $('.autocomplete2').autocomplete({
          data: data,
          limit: 10, // The max amount of results that can be shown at once. Default: Infinity.
          onAutocomplete: function(val) {
            //
          },
          minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
        });
        $('#autocompleteFood').autocomplete({
          data: data,
          limit: 10, // The max amount of results that can be shown at once. Default: Infinity.
          onAutocomplete: function(val) {
            var index = -1;
            for(var i = 0; i < food.length; i++){
              if(food[i].title_food.replace(/ /g, "").toLowerCase() == val.replace(/ /g, "").toLowerCase()){
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

    //Récupérer les caractéristiques de toute les recettes
    $http.get("/recipes/types").then(function(response){
      types = response.data;
    });
    $http.get("/recipes/difficulties").then(function(response){
      difficulties = response.data;
    });
    $http.get("/recipes/origins").then(function(response){
      origins = response.data;
    });

  }]);

  app.controller("ConnectionCtrl",["$http", '$cookies', function($http, $cookies){
    this.connection = {};
    var connectionCtrl = this;

    this.newPassword = function(mailAdress){
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

    // Connection
    this.getConnection = function(){
      chargement = true;
      $http.post('/connection', this.connection).then(function(response){
        chargement = false;
        connectionCtrl.connection = {};
        if("error" in response.data){
          Materialize.toast(response.data.error, 3000);
        }
        else {
          user = response.data;
          initStayConnected(response.data, $cookies);
          getFood(user.id_user, $http);
          getRecipes(user.id_user, $http);
          Materialize.toast("Connecté.", 3000);
        }
      });
    };

  }]);

  app.controller("InscriptionCtrl",["$http", function($http){
    this.inscription = {};
    var inscriptionCtrl = this;
    //Inscription
    this.getInscription = function(){
      chargement = true;
      $http.post('/inscription', this.inscription).then(function(response){
        chargement = false;
        inscriptionCtrl.inscription = {};
        if("error" in response.data){
          Materialize.toast(response.data.error, 3000);
        }
        else {
          Materialize.toast("Inscrit.", 3000);
        }
      });
    };
  }]);

  app.controller("NavCtrl",["$cookies", function($cookies){

    //deconnection de l'utilisateur
    this.deconnection = function(){
      user = {};
      user.food = {};
      user.recipes = {};
      $cookies.remove("cookiecode");
      Materialize.toast("Déconnecté.", 3000);
    }
  }]);

  app.controller("MyProfileCtrl",["$http", function($http){
    this.editPassword = {};
    var myProfileCtrl = this;

    //Changer le mot de passe
    this.editPassword = function(){
      chargement = true;
      var params = this.editpassword;
      params.id_user = user.id_user;
      $http.put('/editPassword', {}, {params: params}).then(function(response){
        chargement = false;
        myProfileCtrl.editpassword = {};
        if("error" in response.data){
          Materialize.toast(response.data.error, 2000);
        }
        else {
          Materialize.toast("Mot de passe modifié.", 3000);
        }
      });
    };

    this.getUser = function(){
      return [user];
    }

  }]);

  app.controller("MyFoodCtrl",["$http", function($http){
    this.food = {};
    this.modal = {};
    this.userfood = user.food;
    this.quantity = 0;
    this.idFood = 0;
    var myFoodCtrl = this;


    this.userFood = function(){
      return user.food;
    }

    //Changer la quantite d'un aliment de l'utilisateur
    var setQuantity = function(id_food, quantity, title_food){
      var find = false;
      for(var i =0; i < user.food.length; i++){
        if(user.food[i].id_food == id_food){
          user.food[i].quantity_getfood = quantity;
          find = true;
        }
      }
      if(!find){
        user.food.push({id_food: id_food, quantity_getfood: quantity, title_food: title_food});
      }
    }

    //Initialiser la fenetre modal
    this.existingFood = function(title_food = this.myFoodAutocomplete){
      this.idFood = existingFood(title_food);
      if(this.idFood){
        this.quantity = getQuantity(this.idFood);
      }
      return this.idFood;
    }

    this.setModalAdd = function(id){
      this.modal.id_food = id;
      this.modal.action = "Ajouter";
      this.modal.title_food = findTitle_food(id);
      this.modal.max = "";
      $("#inputModal").select();
    }
    this.setModalSub = function(id, q){
      this.modal.id_food = id;
      this.modal.action = "Enlever";
      this.modal.title_food = findTitle_food(id);
      this.modal.max = q;
      $("#inputModal").select();
    }
    this.setModalNew = function(id){
      this.modal.id_food = id;
      this.modal.action = "Initialiser";
      this.modal.title_food = findTitle_food(id);
      this.modal.max = "";
      $("#inputModal").select();
    }



    //Modifier quantite d'aliment
    this.updateQuantityFood = function(id_food, action, modalValue, title_food){
      var actualQuantity = getQuantity(id_food);
      var id_user = user.id_user;
      switch (action){
        case "Ajouter":
          var newValue = parseInt(actualQuantity) + parseInt(modalValue);
          setQuantity(id_food, newValue, title_food);
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
            deleteFood(id_food);
            $http.delete("user/delFood", {params: {id_user: id_user, id_food: id_food}});
          }
          else if(newValue > 0){
            setQuantity(id_food, newValue);
            var data = {id_user: id_user, id_food: id_food, quantity_getfood: newValue};
            $http.put("user/setFood", {}, {params: data});
          }
          else{
            Materialize.toast("Erreur : valeur finale négative.");
          }
          break;

        case "Initialiser":
          var newValue = modalValue;
          setQuantity(id_food, newValue, title_food);
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
          deleteFood(id_food);
          $http.delete("user/delFood", {params: {id_user: id_user, id_food: id_food}});
          break;
      }
      this.quantity = 0;
      this.myFoodAutocomplete = "";
      $("#autocompleteMyFood").select();
    }

  }]);

  app.controller("FoodCtrl",["$http", function($http){
    this.foodrow1 = {};
    this.foodrow2 = {};
    this.page = 0;
    this.totalPage = [];
    this.food = food;

    var foodCtrl = this;

    this.changePage = function(numpage){
      if(numpage > 0 && numpage <= this.totalPage.length){
        this.page = numpage;
        this.foodrow1 = food.slice((this.page-1)*50, (this.page-1)*50 + 25);
        this.foodrow2 = food.slice((this.page-1)*50+25, (this.page-1)*50 + 50);
      }
    }

    $http.get('/food/all')
    .then(function(response){
      if("error" in response.data){
        Materialize.toast(response.data.error, 2000);
      }
      else {
        foodCtrl.food = response.data;
        for(var i = 0 ; i <= Math.trunc(response.data.length/50); i++){
          foodCtrl.totalPage.push(i + 1);
        }
        foodCtrl.changePage(1);
      }
    });



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
    }
    this.disableRight = function(){
      return(this.page == this.totalPage.length ? "disabled" : "");
    }

  }]);

  app.controller("RecipesCtrl",["$http", function($http){
    this.recipes = {};
    this.search = {
      show : 0,
      myFood : false
    }
    this.nutrionalValues = ["Prix","Calories","Protéines","Lipides","Glucides"];

    var recipesCtrl = this;

    this.getRecipes = function(){
      return recipes;
    }

    $http.get("/recipes/getAll")
    .then(function(response){
      recipes = response.data;
    });

    this.makeShowRecipe = function(id_recipe){
      $http.get("/recipes/getOne",{params: {id_recipe: id_recipe}}).then(function(response){
        if("error" in response.data){
          Materialize.toast(response.data.error, 2000);
        }
        else{
          var rows = response.data;
          var instructions = [];
          var food = [];
          var title_food_Arr = [];
          var quantity_containfood_Arr = [];
          var row = {};
          var price = 0;
          var calorie = 0;
          var proteins = 0;
          var lipids = 0;
          var carbohydrates = 0;
          var quantityTotal = 0;

          rows.forEach(function(row){
            if(instructions.indexOf(row.title_instruction) == -1){
              instructions.push(row.title_instruction);
            }
            if(title_food_Arr.indexOf(row.title_food) == -1){
              title_food_Arr.push(row.title_food);
              quantity_containfood_Arr.push(row.quantity_containfood);
              price += row.price*row.quantity_containfood/1000;
              calorie += row.calorie*row.quantity_containfood/100;
              proteins += row.proteins*row.quantity_containfood/100;
              lipids += row.lipids*row.quantity_containfood/100;
              carbohydrates += row.carbohydrates*row.quantity_containfood/100;
              quantityTotal += row.quantity_containfood;
            }
          });

          for(var i = 0; i < title_food_Arr.length; i++){
            food.push({title_food: title_food_Arr[i], quantity_containfood: quantity_containfood_Arr[i]});
          }
          var row1 = rows[0];
          recipe = {
            id_recipe: row1.id_recipe,
            title_recipe: row1.title_recipe,
            time_recipe : row1.time_recipe,
            description: row1.description,
            title_difficulty: row1.title_difficulty,
            popularity: row1.popularity,
            peopleamount: row1.peopleamount,
            imgurl: row1.imgurl,
            title_type: row1.title_type,
            title_origin: row1.title_origin,
            title_difficulty: row1.title_difficulty,
            instructions: instructions,
            food: food,
            price: price,
            calorie: calorie/(quantityTotal/100),
            proteins: proteins/(quantityTotal/100),
            lipids: lipids/(quantityTotal/100),
            carbohydrates: carbohydrates/(quantityTotal/100),
            totalQuantity: quantityTotal
          }
        }
      });
      $http.post("recipes/addView",{id_recipe: id_recipe}).then(function(response){
        if("error" in response.data){
          Materialize.toast(response.data.error, 2000);
        }
      });
    }

    this.findRecipes = function(){
      $http.get("/recipes/find",{params:{id_user: user.id_user}}).then(function(response){
        if("error" in response.data){
          Materialize.toast(response.data.error, 2000);
        }
        else{
          recipes = response.data;
        }
      });
    }

    this.switchShowSearch = function(){
      this.types = types;
      this.difficulties = difficulties;
      this.origins = origins
      this.search.show = Math.abs(this.search.show - 1);
      $(document).ready(function() {
        $('select').material_select();
      });
    }

    this.showSearch = function(){
      return this.search.show;
    }

  }]);

  app.controller("MyRecipesCtrl",["$http", function($http){
    this.buttonType = 'add';
    this.showForm = false;
    this.addRecipe = {submitvalue: "Créer la recette", submiticon: "library_add", food: {}};
    this.food = [];
    this.review = {};
    this.instructions = [];
    this.instruction = "";

    var myRecipesCtrl = this;

    this.userRecipes = function(){
      return user.recipes;
    }
    var myRecipesCtrl = this;

    this.setForm = function(){
      if(this.showForm){
        this.showForm = false;
        this.buttonType = 'add';
      }else {
        this.showForm = true;
        this.buttonType = 'stop';
        this.types = types;
        this.difficulties = difficulties;
        this.origins = origins
      }
    }

    this.existingFood = function(title_food){
      return existingFood(title_food);
    }

    this.addFood = function(foodReview = this.review){
      if(foodReview.title_food && existingFood(foodReview.title_food) && foodReview.quantity_containfood){
        var food = foodReview;
        food.id_food = existingFood(food.title_food);
        this.food.push(food);
        this.review = {};
      }
      else{
        Materialize.toast("Champs incorrectes.",2000);
      }
    }

    this.deleteFood = function (id_food){
      for(var i = 0; i < this.food.length; i++){
        if(this.food[i].id_food == id_food){
          this.food.splice(i,1);
        }
      }
    }

    this.addInstruction = function(){
      if(this.instruction && this.instruction.length <= 120){
        var instruction = this.instruction;
        this.instructions.push(instruction);
        this.instruction = "";
      }
      else{
        Materialize.toast("Champs incorrectes.",2000);
      }
    }

    this.deleteInst = function(instruction){
      for(var i = 0; i < this.instructions.length; i++){
        if(this.instructions[i] == instruction){
          this.instructions.splice(i,1);
        }
      }
    }


    this.createRecipe = function(){
      chargement = true;
      if(this.addRecipe.title_recipe
      && this.addRecipe.id_type
      && this.addRecipe.id_origin
      && this.addRecipe.id_difficulty
      && this.addRecipe.peopleamount
      && this.addRecipe.description
      && this.food.length > 0
      && this.instructions.length > 0
      && this.addRecipe.imgurl
      && this.addRecipe.time_recipe > 0){
        var recipe = this.addRecipe;
        recipe.food = this.food;
        recipe.instructions = this.instructions;
        recipe.id_user = user.id_user;
        $http.post("/recipes/add", recipe).then(function(response){
          if("error" in response.data){
            Materialize.toast(response.data.error, 2000);
          }
          else{

            Materialize.toast("Crée.", 2000);
            myRecipesCtrl.addRecipe = {};
            myRecipesCtrl.food = [];
            myRecipesCtrl.review = {};
            myRecipesCtrl.instructions = [];
            myRecipesCtrl.showForm = false;
            myRecipesCtrl.buttonType = 'add';
            user.recipes.push(response.data);
            recipes.push(response.data);
          }
          chargement = false;
        });
      }
      else {
        chargement = false;
        Materialize.toast("Champs incorrectes.",2000);
      }
    }

    this.makeShowRecipe = function(id_recipe){
      $http.get("/recipes/getOne",{params: {id_recipe: id_recipe}}).then(function(response){
        if("error" in response.data){
          Materialize.toast(response.data.error, 2000);
        }
        else{
          recipe = response.data;
        }
      });
    }

    this.deleteRecipe = function(id_recipe){
      for(var i = 0; i < user.recipes.length; i++){
        if(user.recipes[i].id_recipe == id_recipe){
          user.recipes.splice(i,1);
        }
      }
      for(var i = 0; i < recipes.length; i++){
        if(recipes[i].id_recipe == id_recipe){
          recipes.splice(i,1);
        }
      }
      $http.delete("/recipes/delete/" + id_recipe).then(function(response){
        if("error" in response.data){
          Materialize.toast(response.data.error, 2000);
        }
      });
    }

  }]);

  app.controller("RecipeCtrl",["$http", function($http){


    this.showRecipe = function(){
      return ('id_recipe' in recipe);
    }

    this.getRecipe = function(){
      Materialize.toast(recipe.length,1000);
      return [recipe];
    }
  }]);


})();
