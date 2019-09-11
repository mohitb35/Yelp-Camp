// Dependencies
const 	express = require('express'), 
		app = express(),
		bodyParser = require('body-parser'), 
		mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

// Letting Express know that we're serving up ejs templates by default.
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// DB Schema set up
let campgroundSchema = mongoose.Schema({
	name: String,
	image: String,
	description: String
});

// DB Model setup
let Campground = mongoose.model("Campground", campgroundSchema);

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
			res.render('campgrounds', {campgrounds: allCampgrounds});
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
			res.redirect('campgrounds');
		}
	})
});

// Campgrounds New Route
app.get('/campgrounds/new', (req, res) => {
	res.render('new');
});

// Campgrounds Show Route
app.get('/campgrounds/:id', (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, fetchedCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("show", {campground: fetchedCampground})
		}
	})
});



// Setting up server to listen at port 3000, or PORT value set as environment (if available)
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Server started', '-', new Date().toLocaleString());
});