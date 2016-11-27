var mongoose = require('mongoose');

var weekSchema = new mongoose.Schema({
    order: Number,
    monday: [{ order: Number, workoutID: Number, workoutName: String, muscle: String , notes: String, sets: [{amount: String, unit: String, }] }],
    tusday: [{ order: Number, workoutID: Number, workoutName: String, muscle: String , notes: String, sets: [{amount: String, unit: String, }] }],
    wednesday: [{ order: Number, workoutID: Number, workoutName: String, muscle: String , notes: String, sets: [{amount: String, unit: String, }] }],
    thursday: [{ order: Number, workoutID: Number, workoutName: String, muscle: String , notes: String, sets: [{amount: String, unit: String, }] }],
    friday: [{ order: Number, workoutID: Number, workoutName: String, muscle: String , notes: String, sets: [{amount: String, unit: String, }] }],
    saturday: [{ order: Number, workoutID: Number, workoutName: String, muscle: String , notes: String, sets: [{amount: String, unit: String, }] }],
    sunday: [{ order: Number, workoutID: Number, workoutName: String, muscle: String , notes: String, sets: [{amount: String, unit: String, }] }],
});

module.exports = mongoose.model('Week', weekSchema);