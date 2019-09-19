const mongoose = require('mongoose');

// DB Schema set up
let commentSchema = mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId, //Mongoose Object IDs that belong to a User
			ref: "User"
		},
		username: String
	}
});

// DB Model setup
module.exports = mongoose.model("Comment", commentSchema);