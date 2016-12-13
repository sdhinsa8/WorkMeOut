var express = require("express");
var app = express();
var morgan = require('morgan');
var fs = require("fs");
var path = require("path");
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var session = require('express-session');
var flash = require('connect-flash');


var passport = require('passport');
require('./config/passport').init(passport);
// read cookies (needed for auth)
app.use(cookieParser());
// get information from html forms
app.use(bodyParser()); 

// required for passport
app.use(session({ secret: 'asdfhasdlkjfhasdkfhasdlkfhsljh' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//Set the database connection
db = require('./models/db');

fs.readdirSync('./models').forEach(function(file) {
	if (path.extname(file) =='.js') {
		require('./models/' + file);
	}
});

//Set the views directory
app.set('views',__dirname + '/views');

//Define templating engine
app.set('view engine','ejs');

//Define how to log events
app.use(morgan('tiny'));

//Load all the routes in the directory
fs.readdirSync('./routes').forEach(function(file) {
	if (path.extname(file) =='.js') {
		require('./routes/' + file).init(app, passport);
	}
});

// Handle static files
app.use(express.static('public'));

// Catch any routes not already handed with an error message
app.use(function(request, response) {
	var message = 'Error, did not understand path' + request.path;
	response.status(404).render('misc/error',{'message': message});
})

var httpServer = require('http').createServer(app);

httpServer.listen(3000, function() {
	console.log('listening on port 3000');
})