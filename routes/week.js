//get week model
var Week = require('../models/week.js');

exports.init = function(app, passport) {


    app.post('/routines/new', isLoggedIn, function(request, response) {
        response.render('routines/new', {message: request.flash('newRoutineMessage')});
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(request, response, next) {

    // if user is authenticated in the session, carry on 
    if (request.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    response.redirect('/');
}
