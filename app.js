// Dependencies
const 	express = require('express'), 
		app = express(),
		bodyParser = require('body-parser'), 
		mongoose = require('mongoose'),
		passport = require('passport'),
		LocalStrategy = require('passport-local'),
		expressSession = require('express-session'),
		Comment = require('./models/comment'),
		Campground = require('./models/campground'),
		User = require('./models/user');

		// let seedDB = require('./seeds');
		
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useNewUrlParser: true });

// seedDB();

// Letting Express know that we're serving up ejs templates by default.
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Config
app.use(expressSession({
	secret: 'Hakuna Matata, what a wonderful phrase',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Dummy Campgrounds array set up - Can be removed
/* let campgrounds = [
	{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
	{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
	{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
	{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
	{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
	{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
]; */

// Routes
// Landing Page
app.get('/', (req, res) => {
	res.render('landing');
});

// Campgrounds Index Roues
app.get('/campgrounds', (req, res) => {
	// Get campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if(err) {
			console.log("Error", err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	})
});

// Campgrounds Create Route
app.post('/campgrounds', (req, res) => {
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
			res.redirect('campgrounds/index');
		}
	})
});

// Campgrounds New Route
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

// Campgrounds Show Route
app.get('/campgrounds/:id', (req, res) => {
	let id = req.params.id;
	Campground.findById(id).populate("comments").exec( (err, fetchedCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: fetchedCampground})
		}
	})
});

// Comment Routes

app.get('/campgrounds/:id/comments/new', (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, fetchedCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground: fetchedCampground})
		}
	})
})

app.post('/campgrounds/:id/comments', (req, res) => {
	let campgroundId = req.params.id;
	let newComment = req.body.comment;
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

// AUTH ROUTES
// =============================

// show register form
app.get('/register', (req, res) => {
	res.render('register');
})

// Sign up logic
app.post('/register', (req, res) => {
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

// Setting up server to listen at port 3000, or PORT value set as environment (if available)
const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log('Server started on port:', port, '-', new Date().toLocaleString());
});