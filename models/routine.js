var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var routineSchema = new mongoose.Schema({
    name: String,
    description: String,
    created: { type: Date, default: Date.now },
    weeks: [ObjectId],
    likes: Number,
    tags: [String],
    createdBy: ObjectId
});

// create the model for routines and expose it to our app
module.exports = mongoose.model('Routine', routineSchema);