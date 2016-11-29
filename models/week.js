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