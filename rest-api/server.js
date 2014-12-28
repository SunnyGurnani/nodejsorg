// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var Bear = require("./models/bear");
var loginRoutes = require('./lib/login/index');
var groupRoutes = require('./lib/groups/index');
var validate_app_key = require('./middlewares/validate-app-key');
mongoose.connect('mongodb://@localhost:27017/group');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-User-Access-Token,X-App-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
 






var port = process.env.PORT || 8090; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

router.use(function(req, res, next) {
   
    console.log('something is happening');
    next();

});

router.route("/bears")
     
     .post(function(req,res) {
		var bear = new Bear();
		bear.name = req.body.name;

		bear.save(function(err){
			if(err)		
				res.send(err);
			
			res.json({message:"Bear Created!"});
			
		});

	}).
	get(function(req,res){

	   Bear.find(function(err, bears){
		if(err)
		   res.send(err);
		res.json(bears);			

		});
		
	
	});

router.route('/bears/:bear_id')
	.get(function(req,res){
	
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err)
				res.send(err);
			res.json(bear);

		});
	
	
	})
	.put(function(req,res){
		
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err)
				res.send(err);

			bear.name = req.body.name;
			bear.save(function(err){
				if(err)
				 res.send(err);

			   res.json({message: 'bear updated!'});

			});
		});
		


	})
	.delete(function(req,res){
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear){
		    if(err)
			res.send(err);

		     res.json({message:"successfully deleted"});	
		
		});
	});
	



// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


app.use('/api/v1', validate_app_key)
app.use('/api/v1', loginRoutes);
app.use('/api/v1', groupRoutes);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);