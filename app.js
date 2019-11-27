// Dependencies
const 	express = require('express'), 
		app = express(),
		bodyParser = require('body-parser'),
		flash = require('connect-flash'), 
		mongoose = require('mongoose'),
		passport = require('passport'),
		LocalStrategy = require('passport-local'),
		expressSession = require('express-session'),
		methodOverride = require('method-override'),
		// Comment = require('./models/comment'),
		// Campground = require('./models/campground'),
		User = require('./models/user');

		// let seedDB = require('./seeds');

const	campgroundRoutes = require('./routes/campgrounds'),
		commentRoutes = require('./routes/comments'),
		indexRoutes = require('./routes/index');
		
mongoose.connect("mongodb://localhost:27017/yelp_camp_v8", 
{ 
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

// seedDB();

// Letting Express know that we're serving up ejs templates by default.
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

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

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Including Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// Setting up server to listen at port 3000, or PORT value set as environment (if available)
const port = process.env.PORT || 3002;
app.listen(port, () => {
	console.log('Server started on port:', port, '-', new Date().toLocaleString());
});