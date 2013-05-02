var Tag = require('mongoose').model('Tag');
var _ = require('underscore');
var apiResponse = require('../utils/apiResponse');
var paginator = require('../utils/paginator');

/**
 * AskController
 * @type {Object}
 */
var AskController = {
  /**
   * Specify which actions are available for this ressource
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  root: function(req, res, next) {
    // var returnObject = {};
    // returnObject._metadata = apiResponse.ok();
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
    // res.json(200, returnObject);
    res.json(501, '/ask is not implemented yet.');
    return next();
  },

  /**
   * Find what is at a Point of Interest
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  whatAt: function(req, res, next) {
    res.json(501, '/whatAt is not implemented yet.');
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

    // Metadata handling
    returnObject._metadata = apiResponse.ok();
    returnObject._metadata.totalCount = totalCount;
    returnObject._metadata.offset = offset;
    returnObject._metadata.limit = limit;

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

        res.json(200, returnObject);
        return next();
    });
  }
};

module.exports = AskController;