
exports.init = function(app) {
    app.get('/', getIndex);
    app.get('/login', getLogin);
    app.get('/signup', getSignup);
    app.post('/signup', postSignup);
    app.get('/profile', getProfile);
    app.post('/login', postLogin);
    app.get('/logout',getLogout);

}

getIndex = function(request, response) {
    message = "Index page for routines";
    response.render('routines/index',{'message': message});
};

getLogin = function(request, response) {
    message = "Index page for routines";
    response.render('routines/index',{'message': message});
};

getSignup = function(request, response) {
    message = "Index page for routines";
    response.render('routines/index',{'message': message});
};

postSignup = function(request, response) {
    message = "Index page for routines";
    response.render('routines/index',{'message': message});
};

getProfile = function(request, response) {
    message = "Index page for routines";
    response.render('routines/index',{'message': message});
};

postLogin = function(request, response) {
    message = "Index page for routines";
    response.render('routines/index',{'message': message});
};

getLogout = function(request, response) {
    message = "Index page for routines";
    response.render('routines/index',{'message': message});
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}