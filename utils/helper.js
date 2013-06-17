var _                  = require('underscore');
var mime               = require('mime');
var responseMeta       = require('../utils/responseboilerplate').responseMeta;
var NotAcceptableError = responseMeta.NotAcceptable;

/**
 * Helper class containing usefull methods.
 * @type {Object}
 */
var helper = {

  /**
   * getNestedProperties check if an object has the nested
   * properties passed in params
   * @param  {Object} obj object we want to test
   * @return {Boolean}    either the object has these nested properties or not
   */
  getNestedProperties: function(obj, properties) {
    properties = properties.split('.') || [];

    var err;

    // For each properties, check if it's an object property
    _.each(properties, function(property) {
      if(!err) {
        if(!_.has(obj, property)) {
          err = true;
        }
        obj = obj[property];
      }
    });

    if(err) {
      return undefined;
    } else {
      return obj;
    }
  },

  /**
   * Returns a plugin that will check if the client's Accept header can be handled
   * by this server.
   *
   * @param {String}      array of accept types.
   * @return {Function}   restify handler.
   */
  acceptParser: function(acceptable) {
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
        result._meta = new NotAcceptableError('Server accepts: ' + acceptable.join());
        res.json(result._meta.statusCode, result);
        next(false);
      }
    }

    return (parseAccept);
  }
};

module.exports = helper;