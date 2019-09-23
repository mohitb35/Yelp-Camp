const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// Comment Routes
// ==========================================================
// New comment form
router.get('/new', middleware.isLoggedIn, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, fetchedCampground) => {
		if(err) {
			console.log(err || !fetchedCampground);
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			res.redirect('back');
		} else {
			res.render('comments/new', {campground: fetchedCampground})
		}
	})
})

// Create comment
router.post('/', middleware.isLoggedIn, (req, res) => {
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
		if(err || !fetchedCampground) {
			console.log(err);
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			res.redirect('/campgrounds')
		} else {
			// Create new comment
			Comment.create(newComment, (err, createdComment) => {
				if(err || !createdComment) {
					console.log(err);
					req.flash("error", "Oops, something went wrong. Please try after some time.");
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
							req.flash("error", "Oops, something went wrong. Please try after some time.");
							res.redirect('/campgrounds/' + fetchedCampground._id);
						} else {
							// Redirect to the campground show page
							req.flash("success", "Comment posted successfully!");
							res.redirect('/campgrounds/' + fetchedCampground._id);
						}
					})
				}
			})
		}
	})
})

// Edit comment form
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	let campgroundId = req.params.id;
	let commentId = req.params.comment_id;
	Campground.findById(campgroundId, (err, fetchedCampground) => {
		if(err || !fetchedCampground) {
			console.log(err);
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			res.redirect('back');
		} else {
			Comment.findById(commentId, (err, fetchedComment) => {
				if(err || !fetchedCampground) {
					console.log(err);
					req.flash("error", "Oops, something went wrong. Please try after some time.");
					res.redirect('back');
				} else {
					res.render('comments/edit', {campground: fetchedCampground, comment: fetchedComment})
				}
			})
		}
	})
})

// Update comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	let campgroundId = req.params.id;
	let commentId = req.params.comment_id;
	Comment.findByIdAndUpdate(commentId, req.body.comment, (err, updatedComment) => {
		if(err || !updatedComment) {
			console.log(err);
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			res.redirect('back');
		} else {
			req.flash("success", "Comment edited successfully!");
			res.redirect('/campgrounds/' + campgroundId);
		}
	})
});

// Destroy comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	let campgroundId = req.params.id;
	let commentId = req.params.comment_id;
	Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
		if(err || !deletedComment) {
			console.log(err);
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			res.redirect('back');
		} else {
			console.log("Deleted comment:", deletedComment);
			req.flash("success", "Comment deleted successfully!");
			res.redirect('/campgrounds/' + campgroundId);
		}
	});
});

module.exports = router;