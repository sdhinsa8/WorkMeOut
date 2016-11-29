var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var routineSchema = new mongoose.Schema({
    name: String,
    description: String,
    created: { type: Date, default: Date.now },
    weeks: [{type: ObjectId, ref: 'Week' }],
    likes: Number,
    tags: [String],
    createdBy: ObjectId
});

//Methods

routineSchema.statics.byUser = function(userId, cb) {
    return this.find({createdBy: userId}, 'name description likes', cb);
};

routineSchema.statics.byId = function(id, cb) {
    return this.find({_id: id}, 'name description likes', cb);
};




// create the model for routines and expose it to our app
module.exports = mongoose.model('Routine', routineSchema);