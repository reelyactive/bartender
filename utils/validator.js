/**
 * Validator is here for validation purposes
 * For example he check the presence of a required paramater
 * on a request.
 */
var responseMeta = require('./responseBoilerplate').ResponseMeta;

var restify = require('restify');

var Validator = {
  /**
   * Check if the param id is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireId: function(req, res, next) {
    Validator.requireParam('id', req, res, next);
  },

  /**
   * Check if the param macs is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireMacs: function(req, res, next) {
    Validator.requireParam('macs', req, res, next);
  },

  /**
   * Check if the param uids is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireUids: function(req, res, next) {
    Validator.requireParam('uids', req, res, next);
  },

  /**
   * Check if the param tagUid is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireTagUid: function(req, res, next) {
    Validator.requireParam('tagUid', req, res, next);
  },

  /**
   * Check if a given param is present in the request
   * @param  {[type]}   req request
   * @param  {[type]}   res response
   * @param  {Function} fn  callback
   */
  requireParam: function(paramName, req, res, next) {
    if(!req.params[paramName]) {
      req.error = new responseMeta.badRequest('Missing required parameter : ' + paramName);
    }
    return next();
  }
};

module.exports = Validator;