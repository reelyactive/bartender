var restify  = require('restify');
var util     = require('util');
var urlUtil  = require('url');
var MESSAGES = require('./messages');

/**
 * Response boilerplate for our API
 * Here is stocked all "templates" for our response in order
 * to have  a common and uniform response
 */
var responseBoilerplate = {
  /**
   * ResponseMeta is usefull for the meta section
   * It also manage all the error handling
   * @type {Object}
   */
  responseMeta: {
    // 200
    Ok: function(message, options) {
      this.message          = message || MESSAGES.response.ok.message;
      this.statusCode       = 200;
      this.developerMessage = MESSAGES.response.ok.developerMessage;
      this.userMessage      = MESSAGES.response.ok.userMessage;
      this.errorCode        = null;
      this.moreInfo         = MESSAGES.response.ok.moreInfo;

      options = options || {};
      this.totalCount       = options.totalCount || 1;

      if(options.perpage !== undefined) {
        this.perpage        = options.perpage;
      }
      if(options.page !== undefined) {
        this.page           = options.page;
      }
    },

    /**
     * Errors template
     */

    // 400
    BadRequest: function(message) {
      restify.RestError.call(this, {
        statusCode     : 400,
        message        : message || MESSAGES.response.badRequest.message,
        constructorOpt : responseBoilerplate.responseMeta.BadRequest
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = MESSAGES.response.badRequest.developerMessage;
      this.userMessage      = MESSAGES.response.badRequest.userMessage;
      this.errorCode        = 400;
      this.moreInfo         = MESSAGES.response.badRequest.moreInfo;
    },

    // 404
    NotFound: function(message) {
      restify.RestError.call(this, {
        statusCode     : 404,
        message        : message || MESSAGES.response.notFound.message,
        constructorOpt : responseBoilerplate.responseMeta.NotFound
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = MESSAGES.response.notFound.developerMessage;
      this.userMessage      = MESSAGES.response.notFound.userMessage;
      this.errorCode        = 404;
      this.moreInfo         = MESSAGES.response.notFound.moreInfo;
    },

    // 406
    NotAcceptable: function(message) {
      restify.RestError.call(this, {
        statusCode     : 406,
        message        : message || MESSAGES.response.notAcceptable.message,
        constructorOpt : responseBoilerplate.responseMeta.NotAcceptable
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = MESSAGES.response.notAcceptable.developerMessage;
      this.userMessage      = MESSAGES.response.notAcceptable.userMessage;
      this.errorCode        = 406;
      this.moreInfo         = MESSAGES.response.notAcceptable.moreInfo;
    },

    // 500
    InternalServerError: function(message) {
      restify.RestError.call(this, {
        statusCode     : 500,
        message        : message || MESSAGES.response.internalServerError.message,
        constructorOpt : responseBoilerplate.responseMeta.InternalServerError
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = MESSAGES.response.internalServerError.developerMessage;
      this.userMessage      = MESSAGES.response.internalServerError.userMessage;
      this.errorCode        = 500;
      this.moreInfo         = MESSAGES.response.internalServerError.moreInfo;
    },

    // 501
    NotImplemented: function(message) {
      restify.RestError.call(this, {
        statusCode     : 501,
        message        : message || MESSAGES.response.notImplemented.message,
        constructorOpt : responseBoilerplate.responseMeta.NotImplemented
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = MESSAGES.response.notImplemented.developerMessage;
      this.userMessage      = MESSAGES.response.notImplemented.userMessage;
      this.errorCode        = 501;
      this.moreInfo         = MESSAGES.response.notImplemented.moreInfo;
    }
  },

  /**
   * ResponseLinks is usefull for the links section
   * @type {Object}
   */
  responseLinks: {
    /**
     * Generate a default link (self > href)
     * @param  {String} href url to generate
     * @return {Object}      default section _links
     */
    setDefault: function(req) {
      var url = req.href();
      url = responseBoilerplate.responseLinks.appendFormat(req, url);
      var _links = {
        self: {
          href: url
        }
      };
      return _links;
    },

    /**
     * Return an absolute url (with path to the version optionnaly)
     * @param  {String}  path        url relative to transform to an absolute
     * @param  {Object}  req         request object
     * @param  {Boolean} withVersion with version in url ?
     * @return {String | Object}     url or link object with href
     */
    toAbsolute: function(path, req, withVersion, simpleUrl) {
      if(req) {
        var parseUrl = urlUtil.parse(req.url);
        var url = parseUrl.protocol + '//' + parseUrl.host;

        if(withVersion) {
          var pathname = parseUrl.pathname.split('/');
          var version  = '/' + (pathname[0] || pathname[1]);
          url += version;
        }

        path = path || '';
        url += path;
        url = responseBoilerplate.responseLinks.appendFormat(req, url);
      } else {
        url = path;
      }

      if(simpleUrl) {
        return url;
      } else {
        var link = {
          href: url
        };
        return link;
      }
    },

    /**
     * Append the format to url if present (e.g. .json)
     * @param  {Object} req Request object
     * @param  {String} url The url
     * @return {String}     url + format
     */
    appendFormat: function(req, url) {
      var format = req.urlFormatRequest || '';
      return url += format;
    }
  }
};

// Inherit from restify errors
for (var key in responseBoilerplate.responseMeta) {
  if (responseBoilerplate.responseMeta.hasOwnProperty(key) &&
     (key !== 'Ok')) {
    var obj = responseBoilerplate.responseMeta[key];
    util.inherits(obj, restify.RestError);
  }
}

module.exports = responseBoilerplate;