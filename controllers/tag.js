var Tag = require('mongoose').model('Tag');
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
    returnObject._metadata = apiResponse.ok();
    returnObject._metadata.offset = offset;
    returnObject._metadata.limit = limit;

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
          returnObject._metadata.totalCount = totalCount;
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
    returnObject._metadata = apiResponse.ok();

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
          return next(new restify.ResourceNotFoundError('No tag  with id ' + id + ' found'));
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
    returnObject._metadata = apiResponse.ok();
    returnObject._metadata.totalCount = totalCount;
    returnObject._metadata.offset = offset;
    returnObject._metadata.limit = limit;

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
            return next(new restify.ResourceNotFoundError(
              'No tags found for visibility: ' + visibility));
          }
          returnObject._metadata.totalCount = totalCount;
          returnObject.tags = tags;

          returnObject._links = paginator.createLinks(url, offset, limit, totalCount);

          res.json(200, returnObject);
          return next();
      });
    });
  }
};

module.exports = TagController;