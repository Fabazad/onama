var express = require('express');
var app = express();
var user = require("user");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
})
.get('/user', function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end('<p>test reussi ' + req.param('id') + '</p>');
})
.get('/connection/', function (req, res) {
  var objet = {name : "hey"};
  res.send('hey' + user.lire());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable ! Sûrement une mauvaise Url ;)');
});
