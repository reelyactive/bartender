/**
 * Paginator is an helper class to handle all paginations functions
 * @type {Object}
 */
var Paginator = {
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

  createLinks: function(url, offset, limit, totalCount) {
    var isQuestioMarkPresent = /\?/.test(url);
    var firstSymbol = isQuestioMarkPresent ? '&' : '?';

    url = url + firstSymbol;

    var next = ((offset + limit) < totalCount) ? (offset + limit) : null;
    if(next) {
      next = url + 'offset=' + next + '&limit=' + limit;
    }

    var prev = ((offset - limit) >= 0) ? (offset - limit) : null;
    if(prev !== null) {
      prev = url + 'offset=' + prev + '&limit=' + limit;
    }

    var last = ((Math.ceil(totalCount / limit) * limit) > 0) ? (Math.ceil(totalCount / limit) * limit) - limit : 0;
    last = url + 'offset=' + last + '&limit=' + limit;

    var links = {
      'self' : {
        'href' : url + 'offset=' + offset + '&limit=' + limit
      },
      'first' : url + 'offset=0&limit=' + limit,
      'next' : next,
      'prev' : prev,
      'last' : last
    };

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

module.exports = Paginator;