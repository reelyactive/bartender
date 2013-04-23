var restify = require('restify');

function entryPoint(req, res, next) {
  var result = {};
  result.supportedVersions = [
    {
      'v': 'v0',
      'href': 'http://localhost:7777/v0'
    }
  ];
  res.json(200, result);
  return next();
}

function notFound (req, res, next) {
  return next(new restify.ResourceNotFoundError('Why did you request the 404 ? ' +
    ' Now, you\'re lost.. '));
}

module.exports = function(server, VERSION) {
  server.get(VERSION + '/', entryPoint);
  server.get(VERSION + '/404', notFound);
};