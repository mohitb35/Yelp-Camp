const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');


// Campgrounds Index Routes
router.get('/', (req, res) => {
	// Get campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if(err || !allCampgrounds) {
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			console.log("Error", err);
			res.redirect('back');
		} else {
			// Sending currentUser forward, diff to do this in every route
			// res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user}); 
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	})
});

// Campgrounds New Route
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

// Campgrounds Create Route
router.post('/', middleware.isLoggedIn, (req, res) => {
	// Create new campground and save to DB
	let newCampground = req.body.campground;
	newCampground.author = {
		id: req.user._id,
		username: req.user.username
	}

	Campground.create(newCampground, (err, createdCampground) => {
		if(err || !createdCampground) {
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			console.log("Error", err);
			res.redirect('back');
		} else {
			console.log("New campground:", createdCampground);
			req.flash("success", "New campground added!");
			res.redirect('/campgrounds');
		}
	})
});

// Campgrounds Show Route
router.get('/:id', (req, res) => {
	let id = req.params.id;
	Campground.findById(id).populate("comments").exec( (err, fetchedCampground) => {
		if(err || !fetchedCampground) {
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			console.log(err);
			res.redirect('back');
		} else {
			console.log("fetched campground:",fetchedCampground);
			res.render('campgrounds/show', {campground: fetchedCampground})
		}
	})
});

// Edit Campground Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, fetchedCampground) => {
		if(err || !fetchedCampground) {
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			console.log(err);
			res.redirect('back');
		} else {
			res.render('campgrounds/edit', {campground: fetchedCampground})
		} 
	})
});

// Update Campground Route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	let id = req.params.id;
	Campground.findByIdAndUpdate(id, req.body.campground, (err, updatedCampground) => {
		if(err || !updatedCampground) {
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			console.log(err);
			res.redirect('/campgrounds/'+id+'/edit');
		} else {
			console.log("Updated campground:", updatedCampground);
			req.flash("success", "Campground updated successfully!");
			res.redirect('/campgrounds/'+id);
		}
	})
});

// Destroy Campground Route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	let id = req.params.id; 
	Campground.findByIdAndDelete(id, (err, deletedCampground) => {
		if(err || !deletedCampground) {
			req.flash("error", "Oops, something went wrong. Please try after some time.");
			console.log(err);
			res.redirect('/campgrounds/'+id);
		} else {
			console.log("Deleted:",deletedCampground);
			Comment.deleteMany({ _id: { $in: deletedCampground.comments }}, (err) => {
				if(err) {
					console.log(err);
					req.flash("error", "Oops, something went wrong. Please try after some time.");
					res.redirect('/campgrounds');
				} else {
					req.flash("success", "Campground deleted successfully!");
					res.redirect('/campgrounds');
				}
			})
		}
	})
});

module.exports = router;