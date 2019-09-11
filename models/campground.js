
const mongoose = require('mongoose');

// DB Schema set up
let campgroundSchema = mongoose.Schema({
	name: String,
	image: String,
	description: String
});

// DB Model setup
module.exports = mongoose.model("Campground", campgroundSchema);