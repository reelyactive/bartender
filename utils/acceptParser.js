var mime = require('mime');

var responseBoilerplate = require('../utils/responseBoilerplate');
var NotAcceptableError = responseBoilerplate.ResponseMeta.notAcceptable;
var responseLinks = responseBoilerplate.ResponseLinks;

/**
 * Returns a plugin that will check the client's Accept header can be handled
 * by this server.
 *
 * @param {String}      array of accept types.
 * @return {Function}   restify handler.
 */
function acceptParser(acceptable) {
  if (!Array.isArray(acceptable)) {
    acceptable = [acceptable];
  }

  acceptable = acceptable.filter(function (a) {
    return (a);
  }).map(function (a) {
    return ((a.indexOf('/') === -1) ? mime.lookup(a) : a);
  }).filter(function (a) {
    return (a);
  });

  function parseAccept(req, res, next) {
    if (req.accepts(acceptable)) {
      next();
      return;
    } else {
      var result = {};
      result._links = responseLinks.setDefault(req);
      result._meta = new NotAcceptableError('Server accepts: ' + acceptable.join());
      res.json(result._meta.statusCode, result);
      next(false);
    }
  }

  return (parseAccept);
}

module.exports = acceptParser;