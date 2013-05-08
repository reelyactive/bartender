/**
 * This is the main file of our API
 * His goal is to launch a server (using restify),
 * then to make a connection with the database,
 * then loads all the routes of our API
 * and finally listening for requests
 */

var restify = require('restify');
var mongoose = require('mongoose');

var serverUtils = require('./utils/serverUtils');
var configurationValidator = require('./utils/configurationValidator');

var CONF, DB_CONF;

console.log('\n# Initialization');

/**
 * Validate the configuration file to avoid errors
 */
configurationValidator.validate(function confValidated(err, CONFIGURATION) {
  if(err) {
    process.exit();
  }

  CONF = CONFIGURATION.CONF;
  DB_CONF = CONFIGURATION.DB_CONF;

  createServer();
});

/**
 * Create a server and launch initialization
 */
function createServer() {
  /**
   * Restify initialization
   */
  var server = restify.createServer({
    name: CONF.APP_NAME,
    version: CONF.VERSION
  });
  serverUtils.configure(server, CONF);

  /**
   * Database connection
   */
  require('./setupdb')(DB_CONF, function databaseConnected(err) {
    if(err) {
      console.log(err);
      process.exit();
    }

    /**
     * Routes initialization
     */
    var versionNumber = parseInt(CONF.VERSION, 10);
    var version = '/v' + versionNumber;
    require('./routes/routeManager').initRoutes(server, version);

    /**
     * Server listening
     */
    console.log('\n## Starting the server');

    server.listen(CONF.PORT, function serverListenning() {
      console.log('-  %s is ready and listening at %s', server.name, server.url);
    });
  });
}

/**
 * When the process exit,
 * close the conenctions with the database
 */
process.on('exit', function() {
  console.log('\n## Proccess exiting');
  mongoose.disconnect(function mongooseDisconnected() {
    console.log('- Database disconnected');
  });
});