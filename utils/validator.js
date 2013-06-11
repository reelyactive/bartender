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
   * Return a boolean based on the validity of the mac
   * @param  {String}  mac mac that we want to test
   * @return {Boolean}     is the mac valid ?
   */
  validateMac: function(mac) {
    var isValidMac = true;
    // 16 lowercase hexadecimal digits splitted in eight groups of two
    // and separated by hyphens or colons
    var isValid = /^(([\w]{2}[-|:]){7}[\w]{2})$/i;
    if(!isValid.test(mac)) {
      isValidMac = false;
    }

    return isValidMac;
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
      macs  = macs.split(',');
      var l = macs.length;
      _.each(macs, function (mac) {
        if(!req.error && !validator.validateMac(mac)) {
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
   * Return a boolean based on the validity of the uuid
   * @param  {String}  uuid uuid that we want to validate
   * @return {Boolean}      is the uuid valid ?
   */
  validateUuid: function(uuid) {
    var isValidUuid = true;
    var isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if(!isValid.test(uuid)) {
      isValidUuid = false;
    }

    return isValidUuid;
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
        if(!req.error && !validator.validateUuid(uuid)) {
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
  },

  /**
   * Assert that the id param is a valid mac OR uuid
   * @param  {Object}   req   request
   * @param  {Object}   res   response
   * @param  {Function} next  callback
   */
  idIsAValidMacOrUuid: function(req, res, next) {
    var id = req.params['id'];
    var isNotAValidMacOrUuid = !(validator.validateMac(id) || validator.validateUuid(id));
    if(isNotAValidMacOrUuid){
      req.error = new responseMeta.BadRequest('Id param isn\'t a valid mac nor uuid.');
    }

    return next();
  }
};

module.exports = validator;