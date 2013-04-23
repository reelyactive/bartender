var restify = require('restify');
var helper = require('./utils/helper');
var CONF = require('./conf');

var server = restify.createServer({
  name: CONF.APP_NAME,
  url: CONF.HOST,
  version: CONF.VERSION
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(helper.setSteps);

var VERSION = '/v' + parseInt(server.versions, 10);
require('./routes')(server, VERSION);

server.listen(CONF.PORT, function () {
  console.log('%s is ready and listening at %s', server.name, server.url);
});