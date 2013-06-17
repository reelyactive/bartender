var restify = require('restify');
var util    = require('util');
var urlUtil = require('url');

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
      this.message          = message || 'ok';
      this.statusCode       = 200;
      this.developerMessage = 'ok';
      this.userMessage      = 'Everything is ok.';
      this.errorCode        = null;
      this.moreInfo         = 'Documentation not implemented yet';

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
        message        : message || 'badRequest',
        constructorOpt : responseBoilerplate.responseMeta.BadRequest
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = 'badRequest';
      this.userMessage      = 'An error occured due to a missing information.';
      this.errorCode        = 400;
      this.moreInfo         = 'Documentation not implemented yet';
    },

    // 404
    NotFound: function(message) {
      restify.RestError.call(this, {
        statusCode     : 404,
        message        : message || 'notFound',
        constructorOpt : responseBoilerplate.responseMeta.NotFound
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = 'notFound';
      this.userMessage      = 'Ressource not found';
      this.errorCode        = 404;
      this.moreInfo         = 'Documentation not implemented yet';
    },

    // 406
    NotAcceptable: function(message) {
      restify.RestError.call(this, {
        statusCode     : 406,
        message        : message || 'notAcceptable',
        constructorOpt : responseBoilerplate.responseMeta.NotAcceptable
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = 'notAcceptable';
      this.userMessage      = 'This action isn\'t supported by the server';
      this.errorCode        = 406;
      this.moreInfo         = 'Documentation not implemented yet';
    },

    // 500
    InternalServerError: function(message) {
      restify.RestError.call(this, {
        statusCode     : 500,
        message        : message || 'internalServerError',
        constructorOpt : responseBoilerplate.responseMeta.InternalServerError
      });
      delete this.body;
      delete this.restCode;
      this.developerMessage = 'internalServerError';
      this.userMessage      = 'An error occured on our side.';
      this.errorCode        = 500;
      this.moreInfo         = 'Documentation not implemented yet';
    },

    // 501
    NotImplemented: function(message) {
      restify.RestError.call(this, {
        statusCode     : 501,
        message        : message || 'notImplemented',
        constructorOpt : responseBoilerplate.responseMeta.NotImplemented
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
      var url = '';
      if(req) {
        var parseUrl = urlUtil.parse(req.url);
        url = parseUrl.protocol + '//' + parseUrl.host;

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