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
		if(err || !user) {
			console.log(err);
			req.flash("error", err.message);
			return res.redirect('/register');
		} else {
			passport.authenticate('local')(req, res, () => {
				req.flash("success", "Welcome to YelpCamp!! " + user.username);
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
/* router.post('/login', passport.authenticate("local", 
	{
		successRedirect: '/campgrounds',
		failureRedirect: '/login',
		failureFlash: true,
		successFlash: "Welcome to YelpCamp!"
	}), (req, res) => {
}); */
router.post('/login', function(req, res, next) {
	let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/campgrounds';
	delete req.session.redirectTo;
	passport.authenticate("local", 
	{
		successRedirect: redirectTo,
		failureRedirect: '/login',
		failureFlash: true,
		successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
	})(req, res, next) 
});

// Logout
router.get('/logout', (req,res) => {
	req.logout();
	req.flash("success", "Logged out of YelpCamp. See you later!!")
	res.redirect('/campgrounds');
});


module.exports = router;