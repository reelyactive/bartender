var _ = require('underscore');
var paginator = require('./paginator');

/**
 * APIResponse is an object that create a standard response
 * @type {Object}
 */
var APIResponse = {
  returnObject: {
    _metadata: {},
    _links: {}
  },

  ok: function(options) {
    var defaults = {
      statusCode: 200,
      message: 'ok',
      developerMessage: 'ok',
      userMessage: 'ok',
      errorCode: null,
      moreInfo: 'ok'
    };
    return APIResponse.returnObject._metadata = _.extend(defaults, options);
  },

  notFound: function(options) {
    var defaults = {
      statusCode: 404,
      message: 'Ressource not found',
      developerMessage: 'notFound',
      userMessage: 'Ressource not found',
      errorCode: 404,
      moreInfo: 'Ressource requested not found'
    };
    return _.extend(defaults, options);
  },

  missingParameter: function(options) {
    var defaults = {
      statusCode: 409,
      message: 'Missing parameter',
      developerMessage: 'missingParameter',
      userMessage: 'An error occured with the last request',
      errorCode: 409,
      moreInfo: 'Missing parameter in the request'
    };
    return _.extend(defaults, options);
  }
};

module.exports = APIResponse;