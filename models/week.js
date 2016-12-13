var mongoose = require('mongoose');

var weekSchema = new mongoose.Schema({
    order: Number,
    monday: [{ rest: String, order: Number, workoutID: Number, workoutName: String, sets: String, amount: String, unit: String }],
    tusday: [{ rest: String, order: Number, workoutID: Number, workoutName: String, sets: String, amount: String, unit: String }],
    wednesday: [{ rest: String, order: Number, workoutID: Number, workoutName: String, sets: String, amount: String, unit: String }],
    thursday: [{ rest: String, order: Number, workoutID: Number, workoutName: String, sets: String, amount: String, unit: String}],
    friday: [{ rest: String, order: Number, workoutID: Number, workoutName: String, sets: String, amount: String, unit: String }],
    saturday: [{ rest: String, order: Number, workoutID: Number, workoutName: String, sets: String, amount: String, unit: String }],
    sunday: [{ rest: String, order: Number, workoutID: Number, workoutName: String, sets: String, amount: String, unit: String }],
});

// create the model for week and expose it to our app
module.exports = mongoose.model('Week', weekSchema);

//note:
//In reality this could have split even further by creating a model for a day, and then just linking that object id to each day of the week,
//Becauuse of time constrains things like that would have taken longer to implement , but i do acknoledge that there is a better way