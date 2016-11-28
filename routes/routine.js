//get Routine model
var Routine = require('../models/routine.js');

exports.init = function(app, passport) {

    app.get('/routines', isLoggedIn, function(request, response) {
        response.render('routines/index', {
            user : request.user
        });
    });

    app.get('/routines/new', isLoggedIn, function(request, response) {
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
