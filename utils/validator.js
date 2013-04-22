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

/**
 * Check if the param uids is present in the request
 * @param  {[type]}   req request
 * @param  {[type]}   res response
 * @param  {Function} fn  callback
 */
function requireUids(req, res, next) {
  if(!req.params.uids) {
    req.error = new restify.MissingParameterError('Missing required parameter : uids.');
  }
  return next();
};

/**
 * Check if the param accountUid is present in the request
 * @param  {[type]}   req request
 * @param  {[type]}   res response
 * @param  {Function} fn  callback
 */
function requireAccountUid(req, res, next) {
  if(!req.params.accountUid) {
    req.error = new restify.MissingParameterError('Missing required parameter : accountUid.');
  }
  return next();
};

/**
 * Check if the param deviceUid is present in the request
 * @param  {[type]}   req request
 * @param  {[type]}   res response
 * @param  {Function} fn  callback
 */
function requireDeviceUid(req, res, next) {
  if(!req.params.deviceUid) {
    req.error = new restify.MissingParameterError('Missing required parameter : deviceUid.');
  }
  return next();
};

exports.requireId = requireId;
exports.requireUids = requireUids;
exports.requireAccountUid = requireAccountUid;
exports.requireDeviceUid = requireDeviceUid;