var mongoose = require('mongoose');

var routineSchema = new mongoose.Schema({
    name: String,
    description: String,
    created: { type: Date, default: Date.now },
    weeks: [ObjectId],
    likes: Number,
    tags: [String]
});