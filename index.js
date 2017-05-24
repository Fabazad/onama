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
  response.render('pages/index');
})

//User Connection/Inscription
.post('/connection', function (req, res, next) {
  user.verifConnection(req, res, next);
}
,function(req, res, next){
  user.addStayConnected(req,res,next);
}
, function(req, res, next){
  user.connection(req, res, next);
})

.post('/connectionCookie', function (req, res, next) {
  user.connectionCookie(req, res, next);
})

.post('/inscription', function (req, res, next) {
  user.verifInscription(req,res,next);
}
,function(req,res,next){

  user.inscription(req,res);
})

.post("/editPassword", function (req, res, next){
  user.verifPassword(req, res, next);
}
,function(req, res, next){
  user.editPassword(req, res);
})

.put("/user/newPassword", function(req, res, next){
  user.verifMail(req, res, next);
}
,function(req, res){
  user.newPassword(req, res);
})

//Food
.get("/food/all", function (req, res) {
  food.getFood(req,res);
})

.get("/user/myfood", function(req, res){
  food.getMyFood(req, res);
})

.post("/user/addFood", function(req, res){
  user.insertFood(req, res);
})

.put("/user/setFood", function(req, res){
  user.updateFood(req, res);
})

.delete("/user/delFood", function(req, res){
  user.deleteFood(req, res);
})

//Recettes

.get("/recipes/:action", function(req, res){
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

    default:
      res.send(404, 'Page introuvable ! Sûrement une mauvaise Url ;)');
  }
})

.get("/user/myRecipes", function(req, res){
  user.getRecipes(req, res);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable ! Sûrement une mauvaise Url ;)');
});
