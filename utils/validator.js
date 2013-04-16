var restify = require('restify');

/**
 * Check if the param id is present in the request
 * @param  {[type]}   req request
 * @param  {[type]}   res response
 * @param  {Function} fn  callback
 */
function requireId(req, res, next) {
  if(!req.params.id) {
    req.error = new restify.MissingParameterError('Missing required parameter : id.');
  }
  return next();
};

exports.requireId = requireId;