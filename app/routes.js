// packages
var mongoose = require('mongoose');
var User = require('./model');

module.exports = function(app) {
  // Get routes
  // ===========================================================================
  // retrieve records for all users in the db
  app.get('/users', function(req, res) {

    var query = User.find();
    query.exec(function(err, users) {
      if (err) {
        res.send(err);
      }

      res.json(users);
    });
  });

  // POST routes
  // ===========================================================================
  // provides method for saving new users in the db
  app.post('/users', function(req, res) {

    // creates a new User based on post body
    var newuser = new User(req.body);

    // New User is saved in the db
    newuser.save(function(err) {
      if (err) {
        res.send(err);
      }

      res.json(req.body);
    });
  });

  // retrieves JSON records for all users who meet a certain set of query conditions
  app.post('/query/', function(req, res) {

    // grab all of the query parameters from the body
    var lat = req.body.latitude;
    var long = req.body.longitude;
    var distance = req.body.distance;
    var male = req.body.male;
    var female = req.body.female;
    var other = req.body.other;
    var minAge = req.body.minAge;
    var maxAge = req.body.maxAge;
    var favLang = req.body.favlang;
    var reqVerified = req.body.reqVerified;

    // opens a generic mongoose query. depending on the post body we will...
    var query = User.find({});

    // ...include filter by Max Distance (converting miles to meters)
    if (distance) {

      // using mongodb's geospatial querying features.
      query.where('location').near({center: {type: 'Point', coordinates: [long, lat]},
        // converting meters to miles. specifying spherical geometry (for globe)
        maxDistance: distance * 1609.34, spherical: true});
    }

    if (male || female || other) {
      query.or([{'gender': male}, {'gender': female}, {'gender': other}]);
    }

    if (minAge) {
      query = query.where('age').gte(minAge);
    }

    if (maxAge) {
      query = query.where('age').lte(maxAge);
    }

    if (favLang) {
      query = query.where('favlang').equals(favLang);
    }

    if (reqVerified) {
      query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
    }

    // execute query and return the query results
    query.exec(function(err, users) {
      if (err) {
        res.send(err);
      }

      res.json(users);
    });
  });
};
