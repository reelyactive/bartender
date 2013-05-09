var restify = require('restify');
var util = require('util');

var ResponseTemplate = {
  // 200
  ok: function(message, options) {
    this.message          = message || 'ok';
    this.statusCode       = 200;
    this.developerMessage = 'ok';
    this.userMessage      = 'Everything is ok.';
    this.errorCode        = null;
    this.moreInfo         = 'Documentation not implemented yet';

    options = options || {};
    this.totalCount       = options.totalCount || 1;
    this.limit            = options.limit || 10;
    this.offset           = options.offset || 0;
  },

  // 400
  badRequest: function(message) {
    restify.RestError.call(this, {
      restCode       : 'Bad Request',
      statusCode     : 400,
      message        : message,
      constructorOpt : ResponseTemplate.badRequest
    });
    delete this.body;
    this.statusCode       = 400;
    this.developerMessage = 'badRequest';
    this.userMessage      = 'An error occured due to a missing information.';
    this.errorCode        = 400;
    this.moreInfo         = 'Documentation not implemented yet';
  },

  // 404
  notFound: function(message) {
    restify.RestError.call(this, {
      restCode       : 'Not Found',
      statusCode     : 404,
      message        : message,
      constructorOpt : ResponseTemplate.notFound
    });
    delete this.body;
    this.statusCode       = 404;
    this.developerMessage = 'notFound';
    this.userMessage      = 'Ressource not found';
    this.errorCode        = 404;
    this.moreInfo         = 'Documentation not implemented yet';
  },

  // 406
  notAcceptable: function(message) {
    restify.RestError.call(this, {
      restCode       : 'Not Acceptable',
      statusCode     : 406,
      message        : message,
      constructorOpt : ResponseTemplate.notAcceptable
    });
    delete this.body;
    this.statusCode       = 406;
    this.developerMessage = 'notAcceptable';
    this.userMessage      = 'This action isn\'t supported by the server';
    this.errorCode        = 406;
    this.moreInfo         = 'Documentation not implemented yet';
  },

  // 500
  internalServerError: function(message) {
    restify.RestError.call(this, {
      restCode       : 'Internal Server Error',
      statusCode     : 500,
      message        : message,
      constructorOpt : ResponseTemplate.internalServerError
    });
    delete this.body;
    this.statusCode       = 500;
    this.developerMessage = 'internalServerError';
    this.userMessage      = 'An error occured on our side.';
    this.errorCode        = 500;
    this.moreInfo         = 'Documentation not implemented yet';
  },

  // 501
  notImplemented: function(message) {
    restify.RestError.call(this, {
      restCode       : 'Not Implemented',
      statusCode     : 501,
      message        : message,
      constructorOpt : ResponseTemplate.notFound
    });
    delete this.body;
    this.statusCode       = 501;
    this.developerMessage = 'notImplemented';
    this.userMessage      = 'The action you\'ve tried isn\'t yet implemented.';
    this.errorCode        = 501;
    this.moreInfo         = 'Documentation not implemented yet';
  }
};

// Inherit from restify errors
for (var key in ResponseTemplate) {
  if (ResponseTemplate.hasOwnProperty(key) && key != 'ok') {
    var obj = ResponseTemplate[key];
    util.inherits(obj, restify.RestError);
  }
}

module.exports = ResponseTemplate;