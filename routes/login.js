var Routine = require('../models/routine.js');

//From lines 5 to 25, and  45 to 68 is from Source: https://scotch.io/tutorials/easy-node-authentication-setup-and-local

exports.init = function(app, passport) {
    app.get('/login', getLogin);
    app.get('/signup', getSignup);
    app.get('/logout',getLogout);

    app.get('/whatILearned', function(request, response) {
        response.render("main/whatILearned");
    });

    app.get('/', isLoggedIn, function(request, response) {
        response.redirect("/profile");
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

     app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(request, response) {
        notThere = {name: "No Current Routine", description: "", weeks: []};
        if (request.user.currentRoutine == undefined) {
                response.render('main/profile', {
                user : request.user, // get the user out of session and pass to template
                currentRoutine: notThere
            }); 
        } else {
            Routine.findById(request.user.currentRoutine).populate('weeks').exec(function(err, rou)  {
                response.render('main/profile', {
                    user : request.user, // get the user out of session and pass to template
                    currentRoutine: rou
                }); 
            });
            
        }
    });
}

getLogin = function(request, response) {
    response.render('main/login',{message: request.flash('loginMessage')});
};

getSignup = function(request, response) {
    response.render('main/signup', { message: request.flash('signupMessage') });
};

getLogout = function(request, response) {
    request.logout();
    response.redirect('/');
};


// route middleware to make sure a user is logged in
function isLoggedIn(request, response, next) {

    // if user is authenticated in the session, carry on 
    if (request.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    response.render('main/index');
}