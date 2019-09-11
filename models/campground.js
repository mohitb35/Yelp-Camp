
const mongoose = require('mongoose');

// DB Schema set up
let campgroundSchema = mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId, //Mongoose Object IDs that belong to a Post
			ref: "Comment"
		}
	]
});

// DB Model setup
module.exports = mongoose.model("Campground", campgroundSchema);