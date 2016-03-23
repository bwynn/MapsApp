// packages
// =============================================================================
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

// config
// =============================================================================
var port = process.env.PORT || 8080;
// config to db
mongoose.connect('mongodb://localhost/MeanMapApp');

// Logging and parsing
app.use(express.static(__dirname + '/public'));

// log responses to console
app.use(morgan('dev'));

// parse data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // parse app/x-www-form-urlencoded
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/vnd.api.json'}));
app.use(methodOverride());

// routes
// =============================================================================
require('./app/routes')(app);

// server
// =============================================================================
app.listen(port);
console.log("Server running on port: " + port);

exports = module.exports = app;
