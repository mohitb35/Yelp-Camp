const Campground = require('../models/campground');
const Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		// Fetch campground details
		Campground.findById(req.params.id, (err, fetchedCampground) => {
			if(err ||!fetchedCampground) {
				req.flash("error", "Oops, something went wrong. Please try after some time.");
				res.redirect('back');
			} else {
				// Did the logged in user create this campground?
				if(fetchedCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You do not have permission to do that!");
					res.redirect('back');
				}
			}
		})
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect('back');
	}
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		// Fetch comment details
		Comment.findById(req.params.comment_id, (err, fetchedComment) => {
			if(err ||!fetchedComment) {
				req.flash("error", "Oops, something went wrong. Please try after some time.");
				res.redirect('back');
			} else {
				console.log("fetched Comment:",fetchedComment);
				// Did the logged in user create this comment?
				if(fetchedComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You do not have permission to do that!");
					res.redirect('back');
				}
			}
		})
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash("error", "You need to be logged in to do that!");
		req.session.redirectTo = req.originalUrl;
		res.redirect('/login');
	}
};

module.exports = middlewareObj;