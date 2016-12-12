//get Routine model
var Routine = require('../models/routine.js');
var Week = require('../models/week.js');
var User = require('../models/user.js');var Routine = require('../models/routine.js');

exports.init = function(app, passport) {
    app.get('/search', isLoggedIn, function(request, response) {
        // searchTerm = request.params.searchTerm
    //    Routine.find({"description": searchTerm})
       response.render('search/search',{
           user: request.user,
       });
    });

    app.get('/searchTerm/:term', isLoggedIn, function(request, response) {
       searchTerm = request.params.term
    //    Routine.find({"description": searchTerm})
       response.send('search/search',{
           user: request.user,
           results: rou
       });
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
