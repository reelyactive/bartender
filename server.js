/**
 *
 *
 *   888888b.                    888                          888
 *   888  "88b                   888                          888
 *   888  .88P                   888                          888
 *   8888888K.   8888b.  888d888 888888 .d88b.  88888b.   .d88888  .d88b.  888d888
 *   888  "Y88b     "88b 888P"   888   d8P  Y8b 888 "88b d88" 888 d8P  Y8b 888P"
 *   888    888 .d888888 888     888   88888888 888  888 888  888 88888888 888
 *   888   d88P 888  888 888     Y88b. Y8b.     888  888 Y88b 888 Y8b.     888
 *   8888888P"  "Y888888 888      "Y888 "Y8888  888  888  "Y88888  "Y8888  888
 *
 *
 */

/**
 * Hi, I'm the bartender !
 *
 * I'm the main actor of this API.
 *
 * My goal is to open the bar (launch a server (using restify)),
 * then to look at the drinks available (make a connection with the database),
 * then to open my book of recipes (loads all the routes of our API)
 * and finally listening for your orders (requests).
 *
 * I hope you're going to order some awesome coktails [and don't forget to give a tip] !
 */

var restify = require('restify');

var configurationValidator = require('./utils/configurationValidator');
var serverManager = require('./utils/serverManager');
var databaseManager = require('./utils/databaseManager');

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
  serverManager.configure(server, CONF);

  /**
   * Database connection
   */
  databaseManager.connectDatabase(DB_CONF, function databaseConnected(err) {
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
      console.log('-  %s is ready and waiting for your orders at %s', server.name, server.url);
    });
  });
}

/**
 * When the process exit,
 * close the conection with the database
 */
process.on('exit', function() {
  console.log('\n## Proccess exiting');
  databaseManager.disconnectDatabase();
});