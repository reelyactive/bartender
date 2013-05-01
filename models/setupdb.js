/**
 * Open a connection with the database
 * Then load our schemas in mongoose
 */
var mongoose = require('mongoose');
var DB_CONF = require('../dbconf');

var uri = 'mongodb://' +
           DB_CONF.HOST + ':' + DB_CONF.PORT + '/' + DB_CONF.DATABASE;

// Connect to the database
mongoose.connect(uri, DB_CONF.OPTIONS);

// Load each models in mongoose
require('./schemas/tag');
require('./schemas/reelceiver');