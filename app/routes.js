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
};
