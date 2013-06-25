var responseBoilerplate = require('./responseboilerplate');
var responseLinks       = responseBoilerplate.responseLinks;
var urlUtil             = require('url');
var _                   = require('underscore');
var MESSAGES            = require('./messages');

/**
 * Paginator is an helper class to handle all paginations functions
 * @type {Object}
 */
var paginator = {

  /**
   * Create links section for the response object based on the url,
   * the page, the perpage and the total count of objects.
   * It returns a predefined object links.
   * @param  {String} url       base url of the current ressource
   * @param  {Int} page         page of the query
   * @param  {Int} perpage      perpage of the query
   * @param  {Int} totalCount   totalCount of ressources
   * @return {Object}           links object
   */
  createLinks: function(req, type, page, perpage, totalCount) {
    // Find the base url
    var url = responseLinks.toAbsolute('/' + type, req, true, true);

    // Avoid two times the same param
    // (e.g. ?perpage=3&page=0&perpage=2)
    var firstSymbol = '?';
    var parseUrl = urlUtil.parse(req.url, true);
    var query = parseUrl.query;
    if(!_.isEmpty(query)) {
      delete query.page;
      delete query.perpage;
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

    // Calculate the pages
    var pages = paginator.calculatePages(page, perpage, totalCount);

    // Now we have the base url and page.
    // We just have to generate links pagination
    var first = null;
    if(totalCount !== 0) {
      first = url + 'page=0&perpage=' + perpage;
    }

    var prev = null;
    if(pages.prev !== null) {
      prev = url + 'page=' + pages.prev + '&perpage=' + perpage;
    }

    var next = null;
    if(pages.next !== null) {
      next = url + 'page=' + pages.next + '&perpage=' + perpage;
    }

    var last = null;
    if(pages.last !== null) {
      last = url + 'page=' + pages.last + '&perpage=' + perpage;
    }

    var links   = {};
    links.self  = responseLinks.toAbsolute(url + 'page=' + page + '&perpage=' + perpage);
    links.self.title  = _.template(MESSAGES.titles.pagination.self, {type: type});
    links.first = responseLinks.toAbsolute(first);
    links.first.title = _.template(MESSAGES.titles.pagination.first, {type: type});
    links.prev  = responseLinks.toAbsolute(prev);
    links.prev.title  = _.template(MESSAGES.titles.pagination.prev, {type: type});
    links.next  = responseLinks.toAbsolute(next);
    links.next.title  = _.template(MESSAGES.titles.pagination.next, {type: type});
    links.last  = responseLinks.toAbsolute(last);
    links.last.title  = _.template(MESSAGES.titles.pagination.last, {type: type});

    return links;
  },

  /**
   * Calculate pages pagination object
   * @param  {Int} page       current page
   * @param  {Int} perpage    number of result per page
   * @param  {Int} totalCount number of total object
   * @return {Object}         the pages object
   */
  calculatePages: function(page, perpage, totalCount) {
    var pages = {};

    if(totalCount === 0) {
      pages = {
        prev: null,
        next: null,
        last: null
      };
    } else {

      var offset = page * perpage;

      /**
       * prev
       */
      var prev = null;
      if(page > 0) {
        prev = page - 1;
      }

      // If the page is more than the totalCount
      if(offset > totalCount) {
        prev = Math.floor(totalCount / perpage);
      }

      pages.prev = prev;

      /**
       * next
       */
      var next = null;
      if(offset < (totalCount - perpage)) {
        next = page + 1;
      }
      pages.next = next;

      /**
       * last
       */
      var last = 0;
      last = Math.floor(totalCount / perpage);
      pages.last = last;
    }

    return pages;
  },

  /**
   * Construct a pagination object from request params
   * and attach it to the request param
   * req.params.page can't be less than 0
   * req.params.perpage can't be less than 0
   * req.params.perpage can't be more than 100
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  paginate: function(req, res, next) {
    var params = req.params;

    var page = params.page || 0;
    var perpage = params.perpage || 10;

    page = parseInt(page, 10);
    perpage = parseInt(perpage, 10);

    if(page < 0) {
      page = 0;
    }

    if(perpage > 100) {
      perpage = 100;
    }

    if(perpage <= 0) {
      perpage = 10;
    }

    params.page = page;
    params.perpage = perpage;

    return next();
  }
};

module.exports = paginator;