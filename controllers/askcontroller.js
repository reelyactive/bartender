var Tag                 = require('../models/tag');
var _                   = require('underscore');
var responseBoilerplate = require('../utils/responseboilerplate');
var responseMeta        = responseBoilerplate.responseMeta;
var responseLinks       = responseBoilerplate.responseLinks;
var paginator           = require('../utils/paginator');

/**
 * AskController
 * @type {Object}
 */
var askController = {

  /**
   * Specify which actions are available for this ressource
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  root: function(req, res, next) {
    // var returnObject = {};
    // returnObject._meta = new responseMeta.ok();
    // returnObject.description = 'Allow you to ask the API';
    // returnObject.supportedActions = [
    //   {
    //     'href': 'whatAt',
    //     'versionsSupported': ['v0']
    //   },
    //   {
    //     'href': 'whereIs',
    //     'versionsSupported': ['v0']
    //   }
    // ];
    // res.json(returnObject);
    var result = {};
    result._meta = new responseMeta.NotImplemented('/ask is not yet implemented');
    res.json(result._meta.statusCode, result);
    return next();
  },

  /**
   * Find what is at a Point of Interest
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  whatAt: function(req, res, next) {
    var result = {};
    result._meta = new responseMeta.NotImplemented('/whatAt is not implemented yet.');
    res.json(result._meta.statusCode, result);
    return next();
  },

  /**
   * Find where is(are) a(many) tag(s)
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  whereIs: function(req, res, next) {
    // Get params
    var params = req.params;
    var macs = params.macs.split(',');
    var offset = params.offset;
    var limit = params.limit;

    var totalCount = macs.length;

    // Instantiate returnObject
    var returnObject = {};
    returnObject._meta = {};

    // Links handling
    var urlBase = 'api/v0/ask/whereis';
    var macsUrl = '?macs=' + params.macs;
    var url = urlBase + macsUrl;
    returnObject._links = paginator.createLinks(url, offset, limit, totalCount);

    macs = macs.slice(offset, offset + limit);

    // Business logic
    returnObject.locations = [];

    Tag
      .where('type').equals('Tag')
      .where('mac').in(macs)
      .exec(function tagsFoundDB(err, tags) {
        if(err) {
          return next(err);
        }
        var result;
        var unmatchedMacs = macs;
        for(var i = 0, l = tags.length; i < l; i++) {
          result = {};
          var tag = tags[i];
          result = tag;
          returnObject.locations.push(result);
          unmatchedMacs = _.without(unmatchedMacs, tag.mac);
        }
        returnObject.matched = _.difference(macs, unmatchedMacs);
        returnObject.unmatched = unmatchedMacs;

        // Metadata handling
        var options = {
          totalCount: totalCount,
          offset: offset,
          limit: limit
        };
        returnObject._meta = new responseMeta.Ok('ok', options);

        res.json(returnObject);
        return next();
      }
    );
  },

  /**
   * Find how is at a Tag or a Point of Interest
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  howIs: function(req, res, next) {
    var result = {};
    result._meta = new responseMeta.NotImplemented('/howIs is not implemented yet.');
    res.json(result._meta.statusCode, result);
    return next();
  }
};

module.exports = askController;