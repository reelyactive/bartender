var Tag = require('mongoose').model('Tag');
var responseTemplate = require('../utils/responseTemplate');
var restify = require('restify');
var paginator = require('../utils/paginator');
var apiResponse = require('../utils/apiResponse');

/**
 * TagController
 * Controller for the ressource Tag
 * @type {Object}
 */
var TagController = {
  /**
   * Find all tags
   */
  findTags: function(req, res, next) {
    // Get params
    var params = req.params;
    var offset = params.offset;
    var limit = params.limit;
    var totalCount = 0;

    // Instantiate returnObject
    var returnObject = {};

    // Metadata handling
    returnObject._meta = apiResponse.ok();
    returnObject._meta.offset = offset;
    returnObject._meta.limit = limit;

    // Links handling
    var urlBase = 'api/v0/tags';
    var url = urlBase;

    // Business logic
    Tag.count({type: 'Tag'}, function tagsCount(err, count) {
      if(err) {
        return next(err);
      }
      totalCount = count;

      Tag
        .find({
          type: 'Tag'
        })
        .skip(offset)
        .limit(limit)
        .exec(function tagsFound(err, tags) {
          if(err) {
            return next(err);
          }
          returnObject._meta.totalCount = totalCount;
          returnObject.tags = tags;

          returnObject._links = paginator.createLinks(url, offset, limit, totalCount);

          res.json(200, returnObject);
          return next();
      });
    });
  },

  /**
   * Find a specific tag
   */
  findTag: function(req, res, next) {
    var id = req.params.id;

    // Instantiate returnObject
    var returnObject = {}

    // Metadata handling
    returnObject._meta = apiResponse.ok();

    // Links handling
    var urlBase = 'api/v0/tags/' + id;
    var url = urlBase;

    // Business logic
    Tag.findOne({
        type: 'Tag',
        mac: id
      }, function tagFound(err, tag) {
        if(err) {
          return next(err);
        }
        if(!tag) {
          var result = {};
          result._meta = new responseTemplate.notFound('No tag  with id ' + id + ' found');
          return res.json(result._meta.statusCode, result);
        }
        returnObject.tag = tag;

        res.json(200, returnObject);
        return next();
    });
  },

  /**
   * Find visible tags
   */
  findTagsVisible: function(req, res, next) {
    TagController.findTagsByVisibility('visible', req, res, next);
  },

  /**
   * Find invisible tags
   */
  findTagsInvisible: function(req, res, next) {
    TagController.findTagsByVisibility('invisible', req, res, next);
  },

  /**
   * Common function for finding tag by their visibility
   */
  findTagsByVisibility: function(visibility, req, res, next) {
    // Get params
    var params = req.params;
    var offset = params.offset;
    var limit = params.limit;
    var totalCount = 0;

    // Instantiate returnObject
    var returnObject = {};

    // Metadata handling
    returnObject._meta = apiResponse.ok();
    returnObject._meta.totalCount = totalCount;
    returnObject._meta.offset = offset;
    returnObject._meta.limit = limit;

    // Links handling
    var urlBase = 'api/v0/tags/' + visibility;
    var url = urlBase;

    // Business logic
    Tag.count({
      type: 'Tag',
      'visibility.value': visibility
    }, function tagsCount(err, count) {
      if(err) {
        return next(err);
      }
      totalCount = count;
      Tag
        .where('type').equals('Tag')
        .where('visibility.value').equals(visibility)
        .skip(offset)
        .limit(limit)
        .exec(function tagsFoundDB(err, tags) {
          if(err) {
            return next(err);
          }
          if(!tags) {
            var result = {};
            var message = 'No tags found for visibility: ' + visibility
            result._meta = new responseTemplate.notFound(message);
            return res.json(result._meta.statusCode, result);
          }
          returnObject._meta.totalCount = totalCount;
          returnObject.tags = tags;

          returnObject._links = paginator.createLinks(url, offset, limit, totalCount);

          res.json(200, returnObject);
          return next();
      });
    });
  }
};

module.exports = TagController;