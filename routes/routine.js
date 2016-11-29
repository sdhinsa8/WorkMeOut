//get Routine model
var Routine = require('../models/routine.js');
var Week = require('../models/week.js');

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

    app.get('/routines/edit/:id', isLoggedIn, function(request, response) {
        Routine.findById(request.params.id).populate('weeks').exec(function(err, rou) {
            response.render('routines/edit', { routine: rou, user : request.user, message: request.flash('indexRoutineMessage')  });
        });
       
    });

    app.get('/api/routines/edit/:id', isLoggedIn, function(request, response) {

        Routine.findById(request.params.id).populate('weeks').exec(function(err, rou) {
            response.send({ routine: rou });
        });
       
    });

    app.get('/routines/new', isLoggedIn, function(request, response) {
        response.render('routines/new', {message: request.flash('newRoutineMessage')});
    });

    app.post('/routines/new', isLoggedIn, function(request, response) {
        var routineWeeksList = [];
        let weekDays = ["Sunday", "Monday","Tusday","Wednesday","Thursday","Friday","Saturday"]
        //create the Week
        let weekData = JSON.parse(request.body.weekData);
        let weekCount = parseInt(request.body.weekCount);
        for (i = 1; i < weekCount + 1; i++) { 
            var newWeek = new Week();
            newWeek.order = i;
            weekDays.forEach(function(day){
                if (weekData[i][day] == []) {
                    var dayRoutine = { 
                            rest: "true",
                        }
                }
                else {
                    console.log(weekData[i][day] ,typeof(weekData[i][day]) );
                    weekData[i][day].forEach(function(excercise){
                        var dayRoutine = { 
                            rest: "false",
                            order: excercise.order,
                            workoutID: excercise.id,
                            workoutName: excercise.name,
                            sets: excercise.set,
                            amount: excercise.amount,
                            unit: excercise.unit
                        }
                        if (day == "Monday") {
                            newWeek.monday.push(dayRoutine)
                        } else if (day == "Tusday") {
                            newWeek.tusday.push(dayRoutine)
                        } else if (day == "Wednesday") {
                            newWeek.wednesday.push(dayRoutine)
                        } else if (day == "Thursday") {
                            newWeek.thursday.push(dayRoutine)
                        } else if (day == "Friday") {
                            newWeek.friday.push(dayRoutine)
                        } else if (day == "Saturday") {
                            newWeek.saturday.push(dayRoutine)
                        } else {
                            newWeek.sunday.push(dayRoutine)
                        } 
                    });
                }
            });
            newWeek.save(function(err) {
                if (err) {
                    request.flash("newRoutineMessage","Could not save Week")
                    response.redirect('routines/new')
                }
            });
            routineWeeksList.push(newWeek._id);
        }


        //create a new Routine
        var newRoutine = new Routine();
        newRoutine.name = request.body.name;
        newRoutine.createdBy = request.user._id;
        newRoutine.description = request.body.description;
        newRoutine.weeks = routineWeeksList;

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
