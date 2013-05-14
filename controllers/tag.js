var Tag = require('mongoose').model('Tag');
var responseBoilerplate = require('../utils/responseBoilerplate');
var responseMeta = responseBoilerplate.ResponseMeta;
var responseLinks = responseBoilerplate.ResponseLinks;
var restify = require('restify');
var paginator = require('../utils/paginator');

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

    // Instantiate result
    var result = {};
    result._meta = {};
    result._links = {};

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

          // Metadata handling
          var options = {
            limit: limit,
            offset: offset
          };

          result._meta = new responseMeta.ok('ok', options);
          result._meta.totalCount = totalCount;

          result.tags = tags;

          result._links = paginator.createLinks(url, offset, limit, totalCount);

          res.json(result);
          return next();
        }
      );
    });
  },

  /**
   * Find a specific tag
   */
  findTag: function(req, res, next) {
    var id = req.params.id;

    // Instantiate result
    var result = {};
    result._meta = {};

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
          result = {};
          var message = 'No tag  with id ' + id + ' found';
          result._meta = new responseMeta.notFound(message);
          return res.json(result._meta.statusCode, result);
        }
        result.tag = tag;

        // Metadata handling
        result._meta = new responseMeta.ok();

        res.json(result);
        return next();
      }
    );
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

    // Instantiate result
    var result = {};
    result._meta = {};

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
            result = {};
            var message = 'No tags found for visibility: ' + visibility;
            result._meta = new responseMeta.notFound(message);
            return res.json(result._meta.statusCode, result);
          }
          result.tags = tags;
          // Metadata handling
          var options = {
            limit: limit,
            offset: offset
          };
          result._meta = new responseMeta.ok('ok', options);

          result._meta.totalCount = totalCount;
          result._links = paginator.createLinks(url, offset, limit, totalCount);

          res.json(result);
          return next();
        }
      );
    });
  }
};

module.exports = TagController;