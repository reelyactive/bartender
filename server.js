/**
 * This is the main file of our API
 * His goal is to launch a server (using restify),
 * then to make a connection with the database,
 * then loads all the routes of our API
 * and finally listening for requests
 */

var restify = require('restify');
var mongoose = require('mongoose');

var helper = require('./utils/helper');
var CONF = require('./conf').CONF;

/**
 * Restify initialization
 */
var server = restify.createServer({
  name: CONF.APP_NAME,
  url: CONF.HOST,
  version: CONF.VERSION
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(helper.setSteps);

/**
 * Database connection
 */
require('./setupdb');

/**
 * Routes initialization
 */
var versionNumber = parseInt(CONF.VERSION, 10);
var version = '/v' + versionNumber;
require('./routes')(server, version);

/**
 * Server listening
 */
server.listen(CONF.PORT, function () {
  console.log('%s is ready and listening at %s', server.name, server.url);
});