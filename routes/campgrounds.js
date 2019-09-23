const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const Comment = require('../models/comment');


// Campgrounds Index Routes
router.get('/', (req, res) => {
	// Get campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if(err) {
			console.log("Error", err);
		} else {
			// Sending currentUser forward, diff to do this in every route
			// res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user}); 
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	})
});

// Campgrounds New Route
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

// Campgrounds Create Route
router.post('/', isLoggedIn, (req, res) => {
	// Create new campground and save to DB
	let newCampground = req.body.campground;
	newCampground.author = {
		id: req.user._id,
		username: req.user.username
	}

	Campground.create(newCampground, (err, createdCampground) => {
		if(err) {
			console.log("Error", err);
		} else {
			console.log("New campground:", createdCampground);
			res.redirect('/campgrounds');
		}
	})
});

// Campgrounds Show Route
router.get('/:id', (req, res) => {
	let id = req.params.id;
	Campground.findById(id).populate("comments").exec( (err, fetchedCampground) => {
		if(err) {
			console.log(err);
		} else {
			console.log("fetched campground:",fetchedCampground);
			res.render('campgrounds/show', {campground: fetchedCampground})
		}
	})
});

// Edit Campground Route
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, fetchedCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.render('campgrounds/edit', {campground: fetchedCampground})
		} 
	})
});

// Update Campground Route
router.put('/:id', checkCampgroundOwnership, (req, res) => {
	let id = req.params.id;
	Campground.findByIdAndUpdate(id, req.body.campground, (err, updatedCampground) => {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds/'+id+'/edit');
		} else {
			console.log("Updated campground:", updatedCampground);
			res.redirect('/campgrounds/'+id);
		}
	})
});

// Destroy Campground Route
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
	let id = req.params.id; 
	Campground.findByIdAndDelete(id, (err, deletedCampground) => {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds/'+id);
		} else {
			console.log("Deleted:",deletedCampground);
			Comment.deleteMany({ _id: { $in: deletedCampground.comments }}, (err) => {
				if(err) {
					console.log(err);
					res.redirect('/campgrounds');
				} else {
					res.redirect('/campgrounds');
				}
			})
		}
	})
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	} else {
		res.redirect('/login');
	}
}

// Middleware to check if user has created campground
function checkCampgroundOwnership(req, res, next) {
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

module.exports = router;