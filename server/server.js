// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var session    = require('client-sessions');
var mongoose   = require('mongoose');


// connect to local database
// NOTE: This is a temp connection to localhost -- change to production
mongoose.connect('mongodb://buddingbudget:buddingbudget@localhost:27017/budding_budget');

// mongoose.NativeConnection.on("error", function(e) {
//   console.log("DBERR: ");
//   console.log(e);
// });

var UserModel    = require('./app/models/user');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setup session handling
app.use(session({
  cookieName: 'session', // session cookie name
  secret: 'sIe0tACPeIyJTOMXUJBkT9Jhr8ryZkgFCpQpJBkqAnvLGftYk86V7GyjolhX', // string used to encrypt cookie values
  duration: 24 * 60 * 60 * 1000, // how long the cookie should exist for (ms)
  activeDuration: 5 * 60 * 1000, // how long after an interaction the cookie should be active for (ms)
}));

// set default port (if not using PORT environment variable)
var port = process.env.PORT || 8081;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// initial entry point for all requests
router.use(function(req, res, next) {
  next();
});

// base route, disable for production
router.get('/', function(req, res, next) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// initial route all users must POST to to receive login token
// POST: credentials { username: u_name, password: password }
router.post('/login', function(req, res, next) {
  // check if user is already logged in, if so do nothing
  if (session.user) {

  }

  // check for username and password

  // if found, attempt login
    // if login is successful, set session username and return success

  // else return error
});

router.post('/create_user', function(req, res, next) {
  console.log(mongoose);
  var user = new UserModel();
  user.username = req.body.username;
  user.name = req.body.name;
  user.password = req.body.password;
  console.log(user.name);
  console.log(user.username);
  console.log(user.password);
  user.data.budget = 0;
  user.data.assets = 0;
  user.data.savings = [];
  user.data.savings.push({name: "emergency", amount: 200, isDefault: true});
  user.data.income = [];
  user.data.income.push({name: "Work", amount: 450, period: 1, start: new Date(2016, 1, 1), holdout: 50, isConfirm: false});
  user.data.charges = [];
  user.data.income.push({name: "Work", amount: 50, period: 1, start: new Date(2016, 1, 1), isConfirm: false});
  user.data.entries = [];
  user.data.entries.push({budget: 25, spent: 20, date: new Date(2016, 2, 9)});
  user.data.userOptions.isNotify = false;
  user.data.userOptions.notifyTime = new Date(0, 0, 0, 9);
  user.data.userOptions.isTrack = false;
  console.log("saving user...");
  user.save(function(err) {
    console.log("save function start");
    if (err)
      res.send(err);
    res.json({message: "user created"});
  });
  console.log("done");
});

// store the user data for the logged in user
// POST: User
router.get('/store_data', function(req, res, next) {
  // check that user is logged in, if not return error

  // parse the data object

  // check that data object user matches logged in user

  // sync user data with stored data

  // send success
});

// delete a user from the system
// GET: username - string
// /api/remove_data?username=<username>
router.delete('/remove_data', function(req, res, next) {
  // check that user is logged in
  // check that username matches logged in user

  // delete user from database

  //send success
});

// get the data for a user
// GET: username - string
// /api/get_data?username=<username>
router.get('/get_data', function(req, res, next) {
  Schemas.User.find(function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
});

router.get('/test', function(req, res, next) {
    if (req.session && req.session.user) {
    	res.json({LoggedIn: "true", User: req.session.user});
    } else {
    	res.json({LoggedIn: "false"});
    }
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Budding Budget server running on port: ' + port);