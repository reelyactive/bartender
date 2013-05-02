/**
 * Open a connection with the database
 * using our configuration
 * Then load our schemas in mongoose to make them
 * available in our app.
 */

var mongoose = require('mongoose');

/**
 * Load the database configuration
 */
var DB_CONF = require('./conf').DB_CONF;

var uri = 'mongodb://' +
           DB_CONF.HOST + ':' + DB_CONF.PORT + '/' + DB_CONF.DATABASE;

/**
 * Connect to the database
 */
mongoose.connect(uri, DB_CONF.OPTIONS);

/**
 * Load each models in mongoose
 */
require('./models/tag');
require('./models/reelceiver');