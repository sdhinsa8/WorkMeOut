//get Routine model
var Routine = require('../models/routine.js');

exports.init = function(app, passport) {

    app.get('/routines', isLoggedIn, function(request, response) {
       //queryResult = Routine.searchByUser(request.user._id);

       Routine.byUser(request.user._id, function(err, rou) {
           response.render('routines/index', { routines: rou, user : request.user , message: request.flash('indexRoutineMessage') });
       })
    });

    app.get('/routines/show/:id', isLoggedIn, function(request, response) {

       Routine.findById(request.params.id, function(err, rou) {
           response.render('routines/show', { routine: rou, user : request.user , message: request.flash('indexRoutineMessage') });
       });
    });

    app.get('/routines/new', isLoggedIn, function(request, response) {
        response.render('routines/new', {message: request.flash('newRoutineMessage')});
    });

    app.post('/routines/new', isLoggedIn, function(request, response) {

        //create a new Routine
        var newRoutine = new Routine();
        newRoutine.name = request.body.name;
        newRoutine.createdBy = request.user._id;
        newRoutine.description = request.body.description;

        newRoutine.save(function(err) {
            if (err) {
                request.flash("newRoutineMessage","Could not save Routine")
                response.redirect('routines/new')
            }
        });
        //request.flash("IndexRoutineMessage","succesfully creates routine")
        response.redirect('/routines');
    });

    app.delete('/routines/delete/:id', isLoggedIn, function(request,response){
        console.log("madeitHere");
        Routine.findByIdAndRemove(request.params.id, function(err) {
            if (err) {
                console.log("could not delete");
            }
            response.send({response: "true"});
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
