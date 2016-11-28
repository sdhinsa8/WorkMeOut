//get Routine model
var Routine = require('../models/routine.js');

exports.init = function(app, passport) {
    app.get('/routines', getRoutines);
}

getRoutines = function(request, response) {
    message = "Index page for routines";
    response.render('routines/index',{'message': message});
};