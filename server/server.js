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
    res.json({message: "Already logged in", user: session.user});
    return;
  }

  // check for username and password
  var username = req.body.username;
  var pass = req.body.password;

  if (!username || !pass) {
    res.json({error: "Missing parameters -- check API reference for required parameters"});
    return;
  }

  // search for user
  UserModel.findOne({'username': username, 'password': pass}, function(err, user) {
    if (!user) {
      res.json({message: "Incorrect username or password"});
      return;
    }
    session.user = user.username;
    res.json({message: "logged in"});
  });
  // if found, attempt login
    // if login is successful, set session username and return success

  // else return error
});

// User API calls
// --------------------------------------------------------------------------------------------
router.route('/user')

.post(function(req, res, next) {
  var user = new UserModel();      // create the user
  user.username = req.body.username;
  user.name = req.body.name;
  user.password = req.body.password;
  if (!user.username || !user.name || !user.password) {
    res.json({error: "Missing parameters -- check API reference for required parameters"});
    return;
  }
  user.data.budget = 0;
  user.data.assets = 0;
  user.data.userOptions.isNotify = false;
  user.data.userOptions.notifyTime = new Date(0, 0, 0, 9);
  user.data.userOptions.isTrack = false;
  user.save(function(err) {
    if (err)
      res.send(err);
    res.json({message: "user created"});
  });
})

.put(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.get(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.delete(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
});

// Queries about getting/updating Track_Entries for the logged in user
// --------------------------------------------------------------------------------------------
router.route('/entry')

// add a new track entry for the user
.post(function(req, res, next) {

  var username = session.user;

  if (!username) {
    res.json({message: "not logged in"});
    return;
  }

  // check the parameters
  var budget = req.body.budget;
  var spent = req.body.spent;
  var year = req.body.year;
  var month = req.body.month;
  var day = req.body.day;
  if (!budget || !spent || !year || !month || !day) {
    res.json({error: "Missing parameters -- check API reference for required parameters"});
    return;
  }

  UserModel.findOne({'username': username}, function(err, user) {
    if (err)
      res.json(err);
    if (!user) {
      res.json({error: "user not found"});
      return;
    }
    console.log(user);
    user.data.entries.push({budget: budget, spent: spent, date: new Date(year, month, day)});
    user.save(function(err) {
      if (err)
        res.json(err);
      res.json({message: "entry added successfully"});
    });
  });
})

.put(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.get(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.delete(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
});

// Calls for updating a user's assets, budget, endDate
// --------------------------------------------------------------------------------------------

router.route('/data')

.put(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.get(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
});

// Calls for updating a user's Savings Entries
// --------------------------------------------------------------------------------------------

router.route('/savings')

.post(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.put(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.get(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.delete(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
});

// Calls for updating a user's Income
// --------------------------------------------------------------------------------------------

router.route('/income')

.post(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.put(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.get(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.delete(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
});

// Calls for updating a user's Charge Entries
// --------------------------------------------------------------------------------------------

router.route('/charges')

.post(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.put(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.get(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.delete(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
});

// Calls for getting or setting a users options
// --------------------------------------------------------------------------------------------

router.route('/options')

.put(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
})

.get(function(req, res, next) {
  res.json({message: "API Endpoint not implemented"});
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Budding Budget server running on port: ' + port);