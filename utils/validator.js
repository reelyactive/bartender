var _            = require('underscore');
var responseMeta = require('./responseboilerplate').responseMeta;
var restify      = require('restify');

/**
 * Validator is here for validation purposes
 * For example he check the presence of a required paramater
 * on a request.
 */
var validator = {
  /**
   * Check if the param id is present in the request
   * @param  {Object}   req   request
   * @param  {Object}   res   response
   * @param  {Function} next  callback
   */
  requireId: function(req, res, next) {
    validator.requireParam('id', req, res, next);
  },

  /**
   * Check if the param macs is present in the request
   * @param  {Object}   req   request
   * @param  {Object}   res   response
   * @param  {Function} next  callback
   */
  requireMacs: function(req, res, next) {
    validator.requireParam('macs', req, res, next);
  },

  /**
   * Check if the param uids is present in the request
   * @param  {Object}   req   request
   * @param  {Object}   res   response
   * @param  {Function} next  callback
   */
  requireUuids: function(req, res, next) {
    validator.requireParam('uuids', req, res, next);
  },

  /**
   * Check if the param tagUid is present in the request
   * @param  {Object}   req   request
   * @param  {Object}   res   response
   * @param  {Function} next  callback
   */
  requireTagUuid: function(req, res, next) {
    validator.requireParam('tagUuid', req, res, next);
  },

  /**
   * Check if a given param is present in the request
   * @param  {String}   paramName   name of the required param
   * @param  {Object}   req         request
   * @param  {Object}   res         response
   * @param  {Function} next        callback
   */
  requireParam: function(paramName, req, res, next) {
    if(!req.params[paramName]) {
      req.error = new responseMeta.BadRequest('Missing required parameter : ' + paramName);
    }
    return next();
  },

  /**
   * Assert that if a macs param is present, it's valid
   * @param  {Object}   req   request
   * @param  {Object}   res   response
   * @param  {Function} next  callback
   */
  isValidMacs: function(req, res, next) {
    var macs = req.params.macs;
    if(macs) {
      macs = macs.split(',');
      var l = macs.length;
      _.each(macs, function validateMac(mac){
        // 16 lowercase hexadecimal digits splitted in eight groups of two
        // and separated by hyphens or colons
        var isValid = /(([\w]{2}[-|:]){7}[\w]{2})/;
        if(!req.error && !isValid.test(mac)) {
          req.error = new responseMeta.BadRequest('macs parameters has a bad formatting.');
          return next();
        }

        if(--l === 0 && !req.error) {
          return next();
        }
      });
    } else {
      return next();
    }
  },

  /**
   * Assert that if a uuids param is present, it's valid
   * @param  {Object}   req   request
   * @param  {Object}   res   response
   * @param  {Function} next  callback
   */
  isValidUuids: function(req, res, next) {
    var uuids = req.params.uuids;
    if(uuids) {
      uuids = uuids.split(',');
      var l = uuids.length;
      _.each(uuids, function validateUuid(uuid){
        var isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if(!req.error && !isValid.test(uuid)) {
          req.error = new responseMeta.BadRequest('uuids parameters has a bad formatting.');
          return next();
        }

        if(--l === 0 && !req.error) {
          return next();
        }
      });
    } else {
      return next();
    }
  }
};

module.exports = validator;