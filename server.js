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

var configurationValidator = require('./utils/configurationvalidator');
var serverManager          = require('./utils/servermanager');
var databaseManager        = require('./models/database/databasemanager');
var routeManager           = require('./routes/routemanager');

var conf, dbConf;

console.log('\n# Initialization');

/**
 * Validate the configuration file to avoid errors
 */
configurationValidator.validate(function confValidated(err, configuration) {
  if(err) {
    process.exit();
  }

  conf    = configuration.conf;
  dbConf  = configuration.dbConf;

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
    name: conf.appName,
    version: conf.version
  });
  serverManager.configure(server, conf);

  /**
   * Database connection
   */
  databaseManager.init(dbConf);
  console.log('\n## Database connection');
  databaseManager.db.connect(function databaseConnected(err) {
    /**
     * If an error occured during the connection
     * log some informations and return the error
     */
    if(err) {
      var errInfos =
        '- Cannot connect with the database.\n' +
        '    First, check that it\'s up and running.\n' +
        '    Then, check your configuration file.\n';
      errInfos = errInfos + err;
      console.log(errInfos);
      process.exit();
    }

    console.log('- Connection with the database: OK');

    /**
     * Routes initialization
     */
    var versionNumber = parseInt(conf.version, 10);
    var version = '/v' + versionNumber;
    routeManager.initRoutes(server, version);

    /**
     * Server listening
     */
    console.log('\n## Starting the server');

    server.listen(conf.port, function serverListenning() {
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
  databaseManager.db.disconnect(function databaseDisconnected() {
    console.log('- Database disconnected');
  });
});