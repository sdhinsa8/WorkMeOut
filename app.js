var morgan = require('morgan');
var fs = require("fs");
var path = require("path");

var express = require("express");
var app = express();

app.set('views',__dirname + '/views');
app.set('view engine','ejs');

app.use(morgan('tiny'))

fs.readdirSync('./routes').forEach(function(file) {
	if (path.extname(file) =='.js') {
		require('./routes/' + file).init(app);
	}
});

app.use(express.static('public'))


app.use(function(req, res) {
	var message = 'Error, did not understand path' + req.path;
	res.status(404).render(error,{'message': message});
})

var httpServer = require('http').createServer(app);

httpServer.listen(3000, function() {
	console.log('listening on port 3000');
})