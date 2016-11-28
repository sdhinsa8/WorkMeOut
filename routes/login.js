
exports.init = function(app, passport) {
    app.get('/', getIndex);
    app.get('/login', getLogin);
    app.get('/signup', getSignup);
    app.get('/logout',getLogout);

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
        response.render('main/profile', {
            user : request.user // get the user out of session and pass to template
        });
    });
}

getIndex = function(request, response) {
    response.render('main/index');
};

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
    response.redirect('/');
}