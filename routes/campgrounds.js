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

// Campgrounds Create Route
router.post('/', isLoggedIn, (req, res) => {
	// Create new campground and save to DB
	let newCampground = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
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

// Campgrounds New Route
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

// Campgrounds Show Route
router.get('/:id', (req, res) => {
	let id = req.params.id;
	Campground.findById(id).populate("comments").exec( (err, fetchedCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: fetchedCampground})
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