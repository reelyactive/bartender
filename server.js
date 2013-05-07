/**
 * This is the main file of our API
 * His goal is to launch a server (using restify),
 * then to make a connection with the database,
 * then loads all the routes of our API
 * and finally listening for requests
 */

var restify = require('restify');
var mongoose = require('mongoose');

var stepManager = require('./utils/stepManager');
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
    version: CONF.VERSION,
  });
  server.acceptable = ['application/json'];
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());
  server.use(stepManager.setSteps);

  // Handle the '.:format' extension
  server.pre(function setHeaderAccept(req, res, next) {
    var acceptJson = (req.url.indexOf('.json') !== -1);
    if(acceptJson) {
      req.headers.accept = "application/json";
    }
    // Clean the url
    req.url = req.url.replace(/\.json$/, "");
    return next();
  });

  /**
   * Database connection
   */
  require('./setupdb')(DB_CONF, function databaseConnected(err) {
    if(err) {
      console.log(err);
      process.exit();
    }

    serverInit();
  });

  /**
   * Once the database connection has been initiated, this function is called
   */
  function serverInit() {

    /**
     * Routes initialization
     */
    var versionNumber = parseInt(CONF.VERSION, 10);
    var version = '/v' + versionNumber;
    require('./routes')(server, version);

    /**
     * Server listening
     */
    console.log('\n## Starting the server');

    server.listen(CONF.PORT, function serverListenning() {
      console.log('-  %s is ready and listening at %s', server.name, server.url);
    });

    server.on('error', function serverError(err) {
      if(err && err.code === 'EADDRINUSE') {
        console.log('- The port ' + CONF.PORT + ' is already in use.');
      }
      console.log(err);
      process.exit();
    });
  }
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