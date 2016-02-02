// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var session   = require('client-sessions');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  cookieName: 'session',
  secret: 'sIe0tACPeIyJTOMXUJBkT9Jhr8ryZkgFCpQpJBkqAnvLGftYk86V7GyjolhX',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// set default port (if not using PORT environment variable)
var port = process.env.PORT || 8080;

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

  // check for username and password

  // if found, attempt login
    // if login is successful, set session username and return success

  // else return error
});

// store the user data for the logged in user
// POST: User
router.post('/store_data', function(req, res, next) {
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