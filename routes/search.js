//get Routine model
var Routine = require('../models/routine.js');
var Week = require('../models/week.js');
var User = require('../models/user.js');var Routine = require('../models/routine.js');

exports.init = function(app, passport) {
    //renders the search page
    app.get('/search', isLoggedIn, function(request, response) {
       response.render('search/search',{
           user: request.user,
       });
    });

    //returns the search term options
    app.get('/searchTerm/:term', isLoggedIn, function(request, response) {
       searchTerm = request.params.term
        Routine.find({"description": { "$regex": searchTerm, "$options": 'i'}} ,function(err, rou){
            if (err) {
                console.log(err);
            } else {
                response.send({
                     results: rou
                });
            }
        });
    });

}
//src: https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// route middleware to make sure a user is logged in
function isLoggedIn(request, response, next) {

    // if user is authenticated in the session, carry on 
    if (request.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    response.redirect('/');
}
