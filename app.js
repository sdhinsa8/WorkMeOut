var morgan = require('morgan');
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");

var express = require("express");
var app = express();

//Set the database connection
db = require('./models/db');

//Set the views directory
app.set('views',__dirname + '/views');

//Define templating engine
app.set('view engine','ejs');

//Define how to log events
app.use(morgan('tiny'));

//Load all the routes in the directory
fs.readdirSync('./routes').forEach(function(file) {
	if (path.extname(file) =='.js') {
		require('./routes/' + file).init(app);
	}
});

// Handle static files
app.use(express.static('public'));

// Catch any routes not already handed with an error message
app.use(function(req, res) {
	var message = 'Error, did not understand path' + req.path;
	res.status(404).render('misc/error',{'message': message});
})

var httpServer = require('http').createServer(app);

httpServer.listen(3000, function() {
	console.log('listening on port 3000');
})