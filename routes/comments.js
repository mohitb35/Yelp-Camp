const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Comment = require('../models/comment');

// Comment Routes
// ==========================================================
// New comment form
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

// Create comment
router.post('/', isLoggedIn, (req, res) => {
	let campgroundId = req.params.id;
	let newComment = req.body.comment;

	// Adding author to the comment
	newComment.author = {
		id: req.user._id,
		username: req.user.username
	};
	console.log(newComment);
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
					// Could do this, but you need to save the comment to the database once more.
					/* createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					createdComment.save(); */

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

// Edit comment form
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
	let campgroundId = req.params.id;
	let commentId = req.params.comment_id;
	Campground.findById(campgroundId, (err, fetchedCampground) => {
		if(err) {
			console.log(err);
		} else {
			Comment.findById(commentId, (err, fetchedComment) => {
				if(err) {
					console.log(err);
					res.redirect('back');
				} else {
					res.render('comments/edit', {campground: fetchedCampground, comment: fetchedComment})
				}
			})
		}
	})
})

// Update comment
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
	let campgroundId = req.params.id;
	let commentId = req.params.comment_id;
	Comment.findByIdAndUpdate(commentId, req.body.comment, (err, updatedComment) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds/' + campgroundId);
		}
	})
});

// Destroy comment
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
	let campgroundId = req.params.id;
	let commentId = req.params.comment_id;
	Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
		if(err) {
			console.log(err);
			res.redirect('back');
		} else {
			console.log("Deleted comment:", deletedComment);
			res.redirect('/campgrounds/' + campgroundId);
		}
	});
});


// Middleware to check if the user is logged in
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	} else {
		res.redirect('/login');
	}
}

// Middleware to check if user has created comment
function checkCommentOwnership(req, res, next) {
	if(req.isAuthenticated()) {
		// Fetch comment details
		Comment.findById(req.params.comment_id, (err, fetchedComment) => {
			if(err) {
				res.redirect('back');
			} else {
				console.log("fetched Comment:",fetchedComment);
				// Did the logged in user create this comment?
				if(fetchedComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		})
	} else {
		res.redirect('back');
	}
}

module.exports = router;