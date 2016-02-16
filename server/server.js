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

var UserModel       = require('./app/models/user');
var userRoute       = require('./routes/user');
var entryRoute      = require('./routes/entry');
var loginRoute      = require('./routes/login');
var incomeRoute     = require('./routes/income');
var optionsRoute    = require('./routes/options');
var chargesRoute    = require('./routes/charges');
var dataRoute       = require('./routes/data');
var savingsRoute    = require('./routes/savings');

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


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/user',    userRoute   );
app.use('/entry',   entryRoute  );
app.use('/login',   loginRoute  );
app.use('/income',  incomeRoute );
app.use('/options', optionsRoute);
app.use('/charges', chargesRoute);
app.use('/data',    dataRoute   );
app.use('/savings', savingsRoute);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Budding Budget server running on port: ' + port);

// ------------------------ HTTP STATUS CODES ------------------------
// 200 - OK
// 401 - Unauthorized (user was not logged in, or login failed)
// 404 - Resource was not found (no user/entry/etc found with that name)
// 422 - missing required parameters
// 500 - internal error (this is almost always a database error)