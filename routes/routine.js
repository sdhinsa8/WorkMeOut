//get Routine model
var Routine = require('../models/routine.js');
var Week = require('../models/week.js');
var User = require('../models/user.js');var Routine = require('../models/routine.js');

exports.init = function(app, passport) {

    //index for routines, which return the users created routines along with their liked routines
    app.get('/routines', isLoggedIn, function(request, response) {
       likeRoutinesResult = [];
       request.user.likes.forEach(function(like, index){
            Routine.findById(like).exec(function(err, lrou) {
                likeRoutinesResult.push(lrou);
                if (index + 1 == request.user.likes.length) {
                    Routine.byUser(request.user._id, function(err, rou) {
                        response.render('routines/index', { routines: rou, user : request.user , likeRoutines: likeRoutinesResult ,message: request.flash('indexRoutineMessage') });
                    });
                }
            });
       });
    });

    //A show page for indivdual routines
    app.get('/routines/show/:id', isLoggedIn, function(request, response) {
       Routine.findById(request.params.id).populate('weeks').exec(function(err, rou) {
           response.render('routines/show', { routine: rou, user : request.user , message: request.flash('indexRoutineMessage') });
       });
    });

    //edit page for a routine
    app.get('/routines/edit/:id', isLoggedIn, function(request, response) {
        Routine.findById(request.params.id).populate('weeks').exec(function(err, rou) {
            response.render('routines/edit', { routine: rou, user : request.user, message: request.flash('indexRoutineMessage')  });
        });
    });

    //edit handler that updates an object
    app.post('/routines/edit/:id', isLoggedIn, function(request, response) {
        let weekData = JSON.parse(request.body.weekData);
        Routine.findById(request.params.id).populate('weeks').exec(function(err, rou) {
            rou.name = request.body.name;
            rou.description = request.body.description;

            rou.weeks[0].save(function(err) {
                if (err) {
                    request.flash("newRoutineMessage","Could not save Routine");
                    response.redirect('routines/edit/request.params.id');
                }
            });


            //itereates routine objects and checks for differences
            for (i = 1; i < rou.weeks.length + 1; i++) { 
                sun = rou.weeks[i - 1].sunday;
                for (j = 0; j < sun.length; j++) { 
                    rou.weeks[i - 1].sunday[j].order = weekData[i]["Sunday"][j].order;
                    rou.weeks[i - 1].sunday[j].workoutID = weekData[i]["Sunday"][j].id;
                    rou.weeks[i - 1].sunday[j].workoutName = weekData[i]["Sunday"][j].name;
                    rou.weeks[i - 1].sunday[j].sets = weekData[i]["Sunday"][j].set;
                    rou.weeks[i - 1].sunday[j].amount = weekData[i]["Sunday"][j].amount;
                    rou.weeks[i - 1].sunday[j].unit = weekData[i]["Sunday"][j].unit;
                }

                mon = rou.weeks[i - 1].monday;
                for (j = 0; j < mon.length; j++) { 
                    rou.weeks[i - 1].monday[j].order = weekData[i]["Monday"][j].order;
                    rou.weeks[i - 1].monday[j].workoutID = weekData[i]["Monday"][j].id;
                    rou.weeks[i - 1].monday[j].workoutName = weekData[i]["Monday"][j].name;
                    rou.weeks[i - 1].monday[j].sets = weekData[i]["Monday"][j].set;
                    rou.weeks[i - 1].monday[j].amount = weekData[i]["Monday"][j].amount;
                    rou.weeks[i - 1].monday[j].unit = weekData[i]["Monday"][j].unit;
                }

                tus = rou.weeks[i - 1].tusday;
                for (j = 0; j < tus.length; j++) { 
                    rou.weeks[i - 1].tusday[j].order = weekData[i]["Tusday"][j].order;
                    rou.weeks[i - 1].tusday[j].workoutID = weekData[i]["Tusday"][j].id;
                    rou.weeks[i - 1].tusday[j].workoutName = weekData[i]["Tusday"][j].name;
                    rou.weeks[i - 1].tusday[j].sets = weekData[i]["Tusday"][j].set;
                    rou.weeks[i - 1].tusday[j].amount = weekData[i]["Tusday"][j].amount;
                    rou.weeks[i - 1].tusday[j].unit = weekData[i]["Tusday"][j].unit;
                }

                wed = rou.weeks[i - 1].wednesday;
                for (j = 0; j < wed.length; j++) { 
                    rou.weeks[i - 1].wednesday[j].order = weekData[i]["Wednesday"][j].order;
                    rou.weeks[i - 1].wednesday[j].workoutID = weekData[i]["Wednesday"][j].id;
                    rou.weeks[i - 1].wednesday[j].workoutName = weekData[i]["Wednesday"][j].name;
                    rou.weeks[i - 1].wednesday[j].sets = weekData[i]["Wednesday"][j].set;
                    rou.weeks[i - 1].wednesday[j].amount = weekData[i]["Wednesday"][j].amount;
                    rou.weeks[i - 1].wednesday[j].unit = weekData[i]["Wednesday"][j].unit;
                }

                thu = rou.weeks[i - 1].thursday;
                for (j = 0; j < thu.length; j++) { 
                    rou.weeks[i - 1].thursday[j].order = weekData[i]["Thursday"][j].order;
                    rou.weeks[i - 1].thursday[j].workoutID = weekData[i]["Thursday"][j].id;
                    rou.weeks[i - 1].thursday[j].workoutName = weekData[i]["Thursday"][j].name;
                    rou.weeks[i - 1].thursday[j].sets = weekData[i]["Thursday"][j].set;
                    rou.weeks[i - 1].thursday[j].amount = weekData[i]["Thursday"][j].amount;
                    rou.weeks[i - 1].thursday[j].unit = weekData[i]["Thursday"][j].unit;
                }

                fri = rou.weeks[i - 1].friday;
                for (j = 0; j < fri.length; j++) { 
                    rou.weeks[i - 1].friday[j].order = weekData[i]["Friday"][j].order;
                    rou.weeks[i - 1].friday[j].workoutID = weekData[i]["Friday"][j].id;
                    rou.weeks[i - 1].friday[j].workoutName = weekData[i]["Friday"][j].name;
                    rou.weeks[i - 1].friday[j].sets = weekData[i]["Friday"][j].set;
                    rou.weeks[i - 1].friday[j].amount = weekData[i]["Friday"][j].amount;
                    rou.weeks[i - 1].friday[j].unit = weekData[i]["Friday"][j].unit;
                }

                sat = rou.weeks[i - 1].saturday;
                for (j = 0; j < sat.length; j++) { 
                    rou.weeks[i - 1].saturday[j].order = weekData[i]["Saturday"][j].order;
                    rou.weeks[i - 1].saturday[j].workoutID = weekData[i]["Saturday"][j].id;
                    rou.weeks[i - 1].saturday[j].workoutName = weekData[i]["Saturday"][j].name;
                    rou.weeks[i - 1].saturday[j].sets = weekData[i]["Saturday"][j].set;
                    rou.weeks[i - 1].saturday[j].amount = weekData[i]["Saturday"][j].amount;
                    rou.weeks[i - 1].saturday[j].unit = weekData[i]["Saturday"][j].unit;
                }

                rou.weeks[i - 1].save(function(err) {
                    if (err) {
                        request.flash("newRoutineMessage","Could not save Routine");
                        response.redirect('routines/edit/request.params.id');
                    }
                });
            }


            rou.save(function(err) {
                if (err) {
                    request.flash("newRoutineMessage","Could not save Routine");
                    response.redirect('routines/edit/request.params.id');
                }
                response.redirect('/routines');
            });
        });
    });

    //when editing the api returns an object
    app.get('/api/routines/edit/:id', isLoggedIn, function(request, response) {

        Routine.findById(request.params.id).populate('weeks').exec(function(err, rou) {
            response.send({ routine: rou });
        });
       
    });

    
    //The new apge for creating a routine
    app.get('/routines/new', isLoggedIn, function(request, response) {
        response.render('routines/new', {message: request.flash('newRoutineMessage')});
    });

    //handles creating a new object
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
                response.redirect('/routines/new')
            }
        });
        //request.flash("IndexRoutineMessage","succesfully creates routine")
        response.redirect('/routines');
    });

    //deletes an object
    app.delete('/routines/delete/:id', isLoggedIn, function(request,response){
        Routine.findByIdAndRemove(request.params.id, function(err) {
            if (err) {
                console.log("could not delete");
            }
            response.send({response: "true"});
        });
    });


    //adds the updated favorite and sets to a new
    app.get('/routines/makeFavorite/:id', isLoggedIn, function(request,response){
        Routine.findById(request.params.id).exec(function(err, rou) {
            request.user.currentRoutine = rou._id;
            request.user.save(function(err) {
                if (err) {
                    console.log("error happened");
                } else {
                    response.redirect('/');
                }
            });
            
            
        });
    });

    //adds a like
    app.get('/routines/like/:id', isLoggedIn, function(request,response){
            request.user.likes.push(request.params.id);
            request.user.save(function(err) {
                if (err) {
                    console.log("error happened");
                } else {
                    response.redirect('back');
                }
            
        });
    });

    //gets rid of a like
    app.get('/routines/dislike/:id', isLoggedIn, function(request,response){
            let index = request.user.likes.indexOf(request.params.id);
            request.user.likes.splice(index, 1);
            request.user.save(function(err) {
                if (err) {
                    console.log("error happened");
                } else {
                    response.redirect('back');
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
