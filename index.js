var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var user = require("user");
var food = require("food");
var recipes = require("recipes");


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  console.log("/");
  response.render('pages/index');
})

//User Connection/Inscription
.post('/connection', function (req, res, next) {
  console.log("/connection");
  user.verifConnection(req, res, next);
}
,function(req, res, next){
  user.addStayConnected(req,res,next);
}
, function(req, res, next){
  user.connection(req, res, next);
})

.post('/connectionCookie', function (req, res, next) {
  console.log("/connectionCookie");
  user.connectionCookie(req, res, next);
})

.post('/inscription', function (req, res, next) {
  console.log("/inscription");
  user.verifInscription(req,res,next);
}
,function(req,res,next){

  user.inscription(req,res);
})

.put("/editPassword", function (req, res, next){
  console.log("/editPassword");
  user.verifPassword(req, res, next);
}
,function(req, res, next){
  user.editPassword(req, res);
})

.put("/user/newPassword", function(req, res, next){
  console.log("/user/newPassword");
  user.verifMail(req, res, next);
}
,function(req, res){
  user.newPassword(req, res);
})

//Food
.get("/food/all", function (req, res) {
  console.log("/food/all");
  food.getFood(req,res);
})

.get("/user/myfood", function(req, res){
  console.log("/user/myFood");
  food.getMyFood(req, res);
})

.post("/user/addFood", function(req, res){
  console.log("/user/addFood");
  user.insertFood(req, res);
})

.put("/user/setFood", function(req, res){
  console.log("/user/setFood");
  user.updateFood(req, res);
})

.delete("/user/delFood", function(req, res){
  console.log("/user/delFood");
  user.deleteFood(req, res);
})

//Recettes

.get("/recipes/:action", function(req, res){
  console.log("/recipes/" + req.params.action);
  switch (req.params.action) {
    case 'getAll':
      recipes.getAll(req, res);
      break;

    case 'types':
      recipes.getTypes(req, res);
      break;

    case 'difficulties':
      recipes.getDifficulties(req, res);
      break;

    case 'origins':
      recipes.getOrigins(req, res);
      break;

    case 'getOne':
      recipes.getOne(req, res);
      break;

    case 'find':
      console.log(Array.isArray(req.query.food));
      if(!Array.isArray(req.query.food)){
        req.query.food = [req.query.food];
      }
      recipes.findRecipes(req, res);
      break;

    default:
      res.send(404, 'Page introuvable ! Sûrement une mauvaise Url ;)');
  }
})

.get("/user/myRecipes", function(req, res){
  console.log("/user/myRecipes");
  user.getRecipes(req, res);
})

.post("/recipes/add", function(req, res, next){
  console.log("/recipes/add");
  recipes.verifAddRecipe(req, res, next);
}
,function(req, res ,next){
  recipes.addRecipe(req, res, next);
}
,function(req, res, next){
  recipes.addInstructions(req, next);

}
,function(req, res){
  recipes.addFood(req, res);
})

.delete("/recipes/delete/:id_recipe", function(req, res){
  recipes.deleteRecipe(req, res);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable ! Sûrement une mauvaise Url ;)');
});
