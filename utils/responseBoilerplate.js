var restify = require('restify');
var util = require('util');

/**
 * Response boilerplate for our API
 * Here is stocked all "templates" for our response in order
 * to have  a common and uniform response
 */
var ResponseBoilerplate = {
  /**
   * ResponseMeta is usefull for the meta section
   * It also manage all the error handling
   * @type {Object}
   */
  ResponseMeta: {
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

      if(options.limit !== undefined) {
        this.limit          = options.limit;
      }
      if(options.offset !== undefined) {
        this.offset         = options.offset;
      }
    },

    /**
     * Errors template
     */

    // 400
    badRequest: function(message) {
      restify.RestError.call(this, {
        statusCode     : 400,
        message        : message || 'badRequest',
        constructorOpt : ResponseBoilerplate.ResponseMeta.badRequest
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = 'badRequest';
      this.userMessage      = 'An error occured due to a missing information.';
      this.errorCode        = 400;
      this.moreInfo         = 'Documentation not implemented yet';
    },

    // 404
    notFound: function(message) {
      restify.RestError.call(this, {
        statusCode     : 404,
        message        : message || 'notFound',
        constructorOpt : ResponseBoilerplate.ResponseMeta.notFound
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = 'notFound';
      this.userMessage      = 'Ressource not found';
      this.errorCode        = 404;
      this.moreInfo         = 'Documentation not implemented yet';
    },

    // 406
    notAcceptable: function(message) {
      restify.RestError.call(this, {
        statusCode     : 406,
        message        : message || 'notAcceptable',
        constructorOpt : ResponseBoilerplate.ResponseMeta.notAcceptable
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = 'notAcceptable';
      this.userMessage      = 'This action isn\'t supported by the server';
      this.errorCode        = 406;
      this.moreInfo         = 'Documentation not implemented yet';
    },

    // 500
    internalServerError: function(message) {
      restify.RestError.call(this, {
        statusCode     : 500,
        message        : message || 'internalServerError',
        constructorOpt : ResponseBoilerplate.ResponseMeta.internalServerError
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = 'internalServerError';
      this.userMessage      = 'An error occured on our side.';
      this.errorCode        = 500;
      this.moreInfo         = 'Documentation not implemented yet';
    },

    // 501
    notImplemented: function(message) {
      restify.RestError.call(this, {
        statusCode     : 501,
        message        : message || 'notImplemented',
        constructorOpt : ResponseBoilerplate.ResponseMeta.notFound
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = 'notImplemented';
      this.userMessage      = 'The action you\'ve tried isn\'t yet implemented.';
      this.errorCode        = 501;
      this.moreInfo         = 'Documentation not implemented yet';
    }
  },

  /**
   * ResponseLinks is usefull for the links section
   * @type {Object}
   */
  ResponseLinks: {
    /**
     * Generate a default link (self)
     * @param  {String} href url to generate
     * @return {Object}      default section _links
     */
    setDefault: function(req) {
      var format = req.urlFormatRequest || '';
      var _links = {
        self: {
          href: req.href() + format
        }
      };
      return _links;
    },

    /**
     * Quick helper for generating a simple link.
     * If req is in the param, then we create an absolute link
     * @param  {String} url url to generate
     * @paramm {Object} req  the request
     * @return {Object}      a simple link
     */
    generateLink: function(url, req) {
      // Create an absolute link
      if(req) {
        url = ResponseBoilerplate.ResponseLinks.toAbsolute(url, req);
      } else {
        var format = req.urlFormatRequest || '';
        url = url + format;
      }
      var link = {
        href: url
      };
      return link;
    },

    /**
     * Transform an url to an absolute one
     * @param  {String} url  relative url
     * @param  {Object} req  the request object
     * @return {String}      absolute url
     */
    toAbsolute: function(url, req) {
      var urlUtil = require('url');
      var parseUrl = urlUtil.parse(req.url);
      url = parseUrl.protocol + '//' + parseUrl.host + url;

      var format = req.urlFormatRequest || '';
      url = url + format;

      return url;
    }
  }
};

// Inherit from restify errors
for (var key in ResponseBoilerplate.ResponseMeta) {
  if (ResponseBoilerplate.ResponseMeta.hasOwnProperty(key) &&
     (key !== 'ok')) {
    var obj = ResponseBoilerplate.ResponseMeta[key];
    util.inherits(obj, restify.RestError);
  }
}

module.exports = ResponseBoilerplate;