var restify = require('restify');
var mongoose = require('mongoose');

var helper = require('./utils/helper');
var CONF = require('./conf');
var DB_CONF = require('./dbconf');

// Restify initialization
var server = restify.createServer({
  name: CONF.APP_NAME,
  url: CONF.HOST,
  version: CONF.VERSION
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(helper.setSteps);

// Database connection
var db = mongoose.createConnection(
  DB_CONF.HOST, DB_CONF.DATABASE, DB_CONF.PORT, DB_CONF.opts);

db.on('error', console.error.bind(console, 'DB connection error:'));
db.on('open', function(err) {
  // Mongoose schemas loading
  require('./models/schemas/tag')(db);

  // Routes initialization
  var VERSION = '/v' + parseInt(server.versions, 10);
  require('./routes')(server, VERSION);

  // Server listenning
  server.listen(CONF.PORT, function () {
    console.log('%s is ready and listening at %s', server.name, server.url);
  });
});