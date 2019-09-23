const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

// Landing Page
router.get('/', (req, res) => {
	res.render('landing');
});


// AUTH ROUTES
// =============================

// show register form
router.get('/register', (req, res) => {
	res.render('register');
})

// Sign up logic
router.post('/register', (req, res) => {
	let newUser = new User({
		username: req.body.username
	});
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			console.log(err);
			return res.redirect('/register');
		} else {
			passport.authenticate('local')(req, res, () => {
				res.redirect('/campgrounds');
			});
		}
	})
})

// show login form
router.get('/login', (req, res) => {
	res.render('login');
})

// Login logic
router.post('/login', passport.authenticate("local", 
	{
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}), (req, res) => {
});

// Logout
router.get('/logout', (req,res) => {
	req.logout();
	req.flash("success", "Logged out of YelpCamp. See you later!!")
	res.redirect('/campgrounds');
});


module.exports = router;