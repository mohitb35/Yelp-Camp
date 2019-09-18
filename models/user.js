const	mongoose = require('mongoose'),
		passportLocalMongoose = require('passport-local-mongoose');


// DB Schema set up
let userSchema = mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(passportLocalMongoose);

// DB Model setup
module.exports = mongoose.model("User", userSchema);