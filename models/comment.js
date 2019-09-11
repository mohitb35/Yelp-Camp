const mongoose = require('mongoose');

// DB Schema set up
let commentSchema = mongoose.Schema({
	text: String,
	author: String
});

// DB Model setup
module.exports = mongoose.model("Comment", commentSchema);