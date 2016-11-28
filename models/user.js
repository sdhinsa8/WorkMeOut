var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


var userSchema = new mongoose.Schema({
    name: String,
    local: { email: String, password: String},
    likes: [ObjectId],
    currentRoutine: ObjectId,
    progress: Number
});


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.getRoutines = function() {
    console.log("gello");
    this.model('Routine').find({createdBy: this._id}, 'name description likes', function(err,data){
        return data;
    });
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);