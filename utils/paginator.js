var responseBoilerplate = require('./responseboilerplate');
var responseLinks       = responseBoilerplate.responseLinks;
var urlUtil             = require('url');
var _                   = require('underscore');

/**
 * Paginator is an helper class to handle all paginations functions
 * @type {Object}
 */
var paginator = {

  /**
   * Create links section for the response object based on the url,
   * the offset, the limit and the total count of objects.
   * It returns a predefined object links.
   * @param  {String} url       base url of the current ressource
   * @param  {Int} offset       offset of the query
   * @param  {Int} limit        limit of the query
   * @param  {Int} totalCount   totalCount of ressources
   * @return {Object}           links object
   */
  createLinks: function(req, type, offset, limit, totalCount) {
    // Find the base url
    var url = responseLinks.toAbsolute('/' + type, req, true, true);

    // Avoid two times the same param
    // (e.g. ?limit=3&offset=0&limit=2)
    var firstSymbol = '?';
    var parseUrl = urlUtil.parse(req.url, true);
    var query = parseUrl.query;
    if(!_.isEmpty(query)) {
      delete query.offset;
      delete query.limit;
      if(!_.isEmpty(query)) {
        var queryString = '?';
        _.each(query, function recreateString(value, key) {
          queryString += key + '=' + value + '&';
        });
        url += queryString.slice(0, -1);
        firstSymbol = '&';
      }
    }
    url = url + firstSymbol;


    // Now we have the base url. We just have to generate links pagination
    var prev = null;
    if ((offset - limit) >= (-limit)) {
      if((offset - limit) < 0) {
        prev = 0;
      } else {
        prev = offset - limit;
      }
    } else {
      prev = null;
    }

    if(prev !== null) {
      prev = url + 'offset=' + prev + '&limit=' + limit;
    }

    var next = ((offset + limit) < totalCount) ? (offset + limit) : null;
    if(next) {
      next = url + 'offset=' + next + '&limit=' + limit;
    }

    var last = ((Math.ceil(totalCount / limit) * limit) > 0) ? (Math.ceil(totalCount / limit) * limit) - limit : 0;
    last = url + 'offset=' + last + '&limit=' + limit;

    var links   = {};
    links.self  = responseLinks.toAbsolute(url + 'offset=' + offset + '&limit=' + limit);
    links.first = responseLinks.toAbsolute(url + 'offset=0&limit=' + limit);
    links.prev  = responseLinks.toAbsolute(prev);
    links.next  = responseLinks.toAbsolute(next);
    links.last  = responseLinks.toAbsolute(last);

    return links;
  },

  /**
   * Construct a pagination object from request params
   * and attach it to the request param
   * req.params.offset can't be less than 0
   * req.params.limit can't be less than 0
   * req.params.limit can't be more than 100
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  paginate: function(req, res, next) {
    var params = req.params;

    var offset = params.offset || 0;
    var limit = params.limit || 10;
    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);

    if(offset < 0) {
      offset = 0;
    }

    if(limit > 100 ) {
      limit = 100;
    }

    if(limit <= 0) {
      limit = 10;
    }

    params.offset = offset;
    params.limit = limit;

    return next();
  }
};

module.exports = paginator;