
/**
 * Module dependencies.
 */

var express = require('express');

//var routes = require('./routes');
//var user = require('./routes/user');
var market = require('./routes/market');
var http = require('http');
var path = require('path');
var simple_recaptcha = require('simple-recaptcha');

var app = express();
//var RedisStore = require('connect-redis')(express);//rash

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret : 'v1rtualfarmersmarket'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



//app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/',market.index);


//display the list of produces
app.get('/produces', market.produces);
//display the list of farmers
app.get('/farmers', market.farmers);
//form for new user
app.get('/newuser',market.newuser);
app.post('/registeruser',market.registeruser);
//form for authentication of any user
app.post('/authenticateuser',market.authenticateuser);
app.get('/error',market.autherror);

app.get('/logout', function(req, res) {
    // delete the session variable
    delete req.session.username;
    // redirect user to homepage
    res.redirect('/');
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
