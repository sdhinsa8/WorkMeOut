var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var routineSchema = new mongoose.Schema({
    name: String,
    description: String,
    created: { type: Date, default: Date.now },
    weeks: [ObjectId],
    likes: Number,
    tags: [String]
});

module.exports = mongoose.model('Routine', routineSchema);