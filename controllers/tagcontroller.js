var _                   = require('underscore');
var Tag                 = require('../models/tag');
var responseBoilerplate = require('../utils/responseboilerplate');
var responseMeta        = responseBoilerplate.responseMeta;
var responseLinks       = responseBoilerplate.responseLinks;
var restify             = require('restify');
var paginator           = require('../utils/paginator');
var versionManager      = require('../versionmanager');

/**
 * TagController
 * Controller for the ressource Tag
 * @type {Object}
 */
var tagController = {

  /**
   * Find all tags
   */
  findTags: function(req, res, next) {
    // Get params
    var params     = req.params;
    var page       = params.page;
    var perpage    = params.perpage;
    var offset     = page * perpage;
    var visibility = params.visibility;
    var totalCount = 0;

    // Instantiate result
    var result     = {};
    result._meta   = {};
    result._links  = {};

    /**
     * Business logic
     */

    // Set conditions for the request
    var conditions = {
      type: 'Tag'
    };

    // Check visibilty param
    var visibilityValues = ['visible', 'invisible'];
    if(visibility && _.contains(visibilityValues, visibility)) {
      conditions.visibility = {
        value: visibility
      };
    } else {
      visibility = 'all';
    }

    // First, count the total number of tags we can access
    Tag.count(conditions, function tagCount(err, count) {
      if(err) {
        return next(err);
      }
      totalCount = count;

      // Then we find the tags based on page/perpage
      Tag
        .find(conditions,
              'uuid mac')
        .skip(offset)
        .limit(perpage)
        .exec(function tagsFound(err, tags) {
          if(err) {
            return next(err);
          }

          // Metadata handling
          var options = {
            perpage: perpage,
            page: page,
            totalCount: totalCount
          };
          result._meta = new responseMeta.Ok('ok', options);
          result._meta.visibility = visibility;

          result.tags = tags;

          // Contain the list of each macs we've got
          var tagsMacs = [];

          _.each(result.tags, function addHrefToTag(tag, index) {
            // Transform the mongoose model instance to a plain object
            tag = tag.toObject();
            // Remove _id as we don't want it in the answer
            delete tag._id;

            tagsMacs.push(tag.mac);

            var tagUrl = responseLinks.toAbsolute('/tags/' + tag.mac, req, true);

            tag = _.extend(tagUrl, tag);
            result.tags[index] = tag;
          });

          // Links handling
          result._links = paginator.createLinks(req, 'tags', page, perpage, totalCount);
          if(totalCount > 0) {
            if(visibility !== 'visible') {
              result._links.visible = responseLinks.toAbsolute('/tags', req, true);
              result._links.visible.href +=  '?visibility=visible';
            }
            if(visibility !== 'invisible') {
              result._links.invisible = responseLinks.toAbsolute('/tags', req, true);
              result._links.invisible.href +=  '?visibility=invisible';
            }

            result._links.whereAreTags = responseLinks.toAbsolute('/ask/whereis', req, true);
            result._links.whereAreTags.href += '?macs=' + tagsMacs;

            result._links.howAreTags   = responseLinks.toAbsolute('/ask/howis', req, true);
            result._links.howAreTags.href += '?macs=' + tagsMacs;
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
          result._meta = new responseMeta.NotFound(message);
          return res.json(result._meta.statusCode, result);
        }
        result.tag = tag;

        // Metadata handling
        result._meta = new responseMeta.Ok();

        res.json(result);
        return next();
      }
    );
  }
};

module.exports = tagController;