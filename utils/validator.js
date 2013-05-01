var restify = require('restify');

var Validator = {
  /**
   * Check if the param id is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireId: function(req, res, next) {
    if(!req.params.id) {
      req.error = new restify.MissingParameterError('Missing required parameter : id.');
    }
    return next();
  },

  /**
   * Check if the param macs is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireMacs: function(req, res, next) {
    if(!req.params.macs) {
      req.error = new restify.MissingParameterError('Missing required parameter : macs.');
    }
    return next();
  },

  /**
   * Check if the param uids is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireUids: function(req, res, next) {
    if(!req.params.uids) {
      req.error = new restify.MissingParameterError('Missing required parameter : uids.');
    }
    return next();
  },

  /**
   * Check if the param accountUid is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireAccountUid: function(req, res, next) {
    if(!req.params.accountUid) {
      req.error = new restify.MissingParameterError('Missing required parameter : accountUid.');
    }
    return next();
  },

  /**
   * Check if the param tagUid is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireTagUid: function(req, res, next) {
    if(!req.params.tagUid) {
      req.error = new restify.MissingParameterError('Missing required parameter : tagUid.');
    }
    return next();
  }
};

module.exports = Validator;