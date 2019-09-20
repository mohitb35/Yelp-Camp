const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');


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
	let newCampground = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description,
		author: {
			id: req.user._id,
			username: req.user.username
		}
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
			res.render('campgrounds/show', {campground: fetchedCampground})
		}
	})
});

// Edit Campground Route
router.get('/:id/edit', (req, res) => {
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
router.put('/:id', (req, res) => {
	let id = req.params.id;
	console.log(req.body);
	Campground.findByIdAndUpdate(id, req.body, (err, updatedCampground) => {
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
router.delete('/:id', (req, res) => {
	let id = req.params.id; 
	Campground.findByIdAndDelete(id, (err) => {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds/'+id);
		} else {
			res.redirect('/campgrounds');
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

module.exports = router;