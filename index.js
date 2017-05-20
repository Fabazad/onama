var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var user = require("user");



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
})
.get('/user', function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  console.log(req);
  res.end('<p>test reussi ' + req.query.id + '</p>');
})
.post('/connection', function (req, res) {
  user.connection(req,res);
})
.post('/inscription', function (req, res, next) {
  user.verifInscription(req,res,next);
}
,function(req,res,next){
  user.inscription(req,res);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable ! Sûrement une mauvaise Url ;)');
});
