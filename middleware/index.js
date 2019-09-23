const Campground = require('../models/campground');
const Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		// Fetch campground details
		Campground.findById(req.params.id, (err, fetchedCampground) => {
			if(err) {
				res.redirect('back');
			} else {
				// Did the logged in user create this campground?
				if(fetchedCampground.author.id.equals(req.user._id)) {
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


middlewareObj.checkCommentOwnership = function(req, res, next) {
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
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next()
	} else {
		res.redirect('/login');
	}
};

module.exports = middlewareObj;