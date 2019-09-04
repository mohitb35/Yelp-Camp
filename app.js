// Dependencies
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();

// Letting Express know that we're serving up ejs templates by default.
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy Campgrounds array set up
let campgrounds = [
	{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
	{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
	{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
	{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
	{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
	{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
];

// Routes
// Landing Page
app.get('/', (req, res) => {
	res.render('landing');
});

// Campgrounds
app.get('/campgrounds', (req, res) => {
	res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', (req, res) => {
	let newCampground = {
		name: req.body.name,
		image: req.body.image
	}
	campgrounds.push(newCampground);
	res.redirect('campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
	res.render('new');
});



// Setting up server to listen at port 3000, or PORT value set as environment (if available)
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Server started');
});