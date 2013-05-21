var _                   = require('underscore');
var Tag                 = require('mongoose').model('Tag');
var responseBoilerplate = require('../utils/responseBoilerplate');
var responseMeta        = responseBoilerplate.ResponseMeta;
var responseLinks       = responseBoilerplate.ResponseLinks;
var restify             = require('restify');
var paginator           = require('../utils/paginator');
var versionManager      = require('../versionManager');

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
    var params     = req.params;
    var offset     = params.offset;
    var limit      = params.limit;
    var visibility = params.visibility;
    var totalCount = 0;

    // Instantiate result
    var result     = {};
    result._meta   = {};
    result._links  = {};

    var currentVersion = '/' + versionManager.currentVersion;

    /**
     * Business logic
     */

    // Set conditions for the request
    var conditions = {
      type: 'Tag'
    };
    if(visibility) {
      conditions.visibility = {
        value: visibility
      }
    }

    // First, count the total number of tags we can access
    Tag.count(conditions, function tagCount(err, count) {
      if(err) {
        return next(err);
      }
      totalCount = count;

      // Then we find the tags based on offset/limit
      Tag
        .find(conditions,
              'uuid mac')
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

          // Contain the list of each macs we've got
          var tagsMacs = [];

          _.each(result.tags, function addHrefToTag(tag, index) {
            // Transform the mongoose model instance to a plain object
            tag = tag.toObject();
            // Remove _id as we don't want it in the answer
            delete tag._id;

            tagsMacs.push(tag.mac);

            var tagUrl = responseLinks.generateLink(currentVersion + '/tags/' + tag.mac, req);
            tag = _.extend(tagUrl, tag);
            result.tags[index] = tag;
          });

          // Links handling
          result._links = paginator.createLinks(req.href(), offset, limit, totalCount);
          if(visibility != 'visible') {
            result._links.visible = responseLinks.generateLink(currentVersion + '/tags?visibility=visible', req);
          }
          if (visibility !== 'invisible') {
            result._links.invisible = responseLinks.generateLink(currentVersion + '/tags?visibility=invisible', req);
          }
          if(totalCount > 0) {
            result._links.whereAreTags = responseLinks.generateLink(currentVersion + '/ask/whereis?macs=' + tagsMacs, req);
            result._links.howAreTags   = responseLinks.generateLink(currentVersion + '/ask/howis?macs=' + tagsMacs, req);
          }

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
    var url = req.href();

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
  }
};

module.exports = TagController;