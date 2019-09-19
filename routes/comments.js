const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Comment = require('../models/comment');

// Comment Routes

router.get('/new', isLoggedIn, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, fetchedCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground: fetchedCampground})
		}
	})
})

router.post('/', isLoggedIn, (req, res) => {
	let campgroundId = req.params.id;
	let newComment = req.body.comment;
	// Lookup the campground
	Campground.findById(campgroundId, (err, fetchedCampground) => {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds')
		} else {
			// Create new comment
			Comment.create(newComment, (err, createdComment) => {
				if(err) {
					console.log(err);
					res.redirect('/campgrounds/' + fetchedCampground._id);
				} else {
					// Add comment to the campground and save
					fetchedCampground.comments.push(createdComment);
					fetchedCampground.save((err) => {
						if(err) {
							console.log(err);
							res.redirect('/campgrounds/' + fetchedCampground._id);
						} else {
							// Redirect to the campground show page
							res.redirect('/campgrounds/' + fetchedCampground._id);
						}
					})
				}
			})
		}
	})
})

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	} else {
		res.redirect('/login');
	}
}

module.exports = router;