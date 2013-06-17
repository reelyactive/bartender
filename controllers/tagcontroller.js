var _                   = require('underscore');
var Tag                 = require('../models/tag');
var responseBoilerplate = require('../utils/responseboilerplate');
var responseMeta        = responseBoilerplate.responseMeta;
var responseLinks       = responseBoilerplate.responseLinks;
var paginator           = require('../utils/paginator');
var validator           = require('../utils/validator');
var helper              = require('../utils/helper');

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
          var tagIdentifiers = [];

          _.each(result.tags, function addHrefToTag(tag, index) {
            // Transform the mongoose model instance to a plain object
            tag = tag.toObject();
            // Remove _id as we don't want it in the answer
            delete tag._id;

            tagIdentifiers.push(tag.mac);

            var tagUrl = responseLinks.toAbsolute('/tags/' + tag.mac, req, true);

            tag = _.extend(tagUrl, tag);
            result.tags[index] = tag;
          });

          result._meta.tagIdentifiers = tagIdentifiers;

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
            result._links.whereAreTags.href += '?macs=' + tagIdentifiers;

            result._links.howAreTags   = responseLinks.toAbsolute('/ask/howis', req, true);
            result._links.howAreTags.href += '?macs=' + tagIdentifiers;
          }

          res.json(result);
          return next();
        }
      );
    });
  },

  /**
   * Find a specific tag (based on an id (uuid or mac) param)
   */
  findTag: function(req, res, next) {
    // Get params
    var id = req.params.id;

    var searchFilters = {
      type: 'Tag'
    };
    if(validator.validateMac(id)) {
      searchFilters.mac = id;
    } else if(validator.validateUuid(id)) {
      searchFilters.uuid = id;
    }

    // Business logic
    Tag.findOne(searchFilters, function tagFound(err, tag) {
      if(err) {
        return next(err);
      }
      if(!tag) {
        var message = 'No tag  with id (uuid or mac) ' + id + ' found';
        var result  = {
          _meta: new responseMeta.NotFound(message)
        };
        res.json(result._meta.statusCode, result);
        return next();
      }

      // Transform the mongoose model instance to a plain object
      tag = tag.toObject();
      tagController.tagFound(tag, req, res, next);
    });
  },

  /**
   * Called when a tag is found
   * Linked to findTag above
   */
  tagFound: function(tag, req, res, next) {
    var result = tag;

    // Remove unwanted attributes from mongo
    delete tag._id;
    delete tag.__v;

    // Add links in our object tag response
    var poi = helper.getNestedProperties(tag, 'location.poi.uuid');
    if(poi !== undefined) {
      tag.location.poi.uri = {
        reelceiver: responseLinks.toAbsolute('/reelceivers/' + poi, req, true)
      };
    }
    var prevPoi = helper.getNestedProperties(tag, 'location.lastChangeEvent.poi.uuid');
    if(prevPoi !== undefined) {
      tag.location.lastChangeEvent.poi.uri = {
        reelceiver: responseLinks.toAbsolute('/reelceivers/' + prevPoi, req, true)
      };
    }

    // Maybe we should pluralize this name as it's an array
    var decodingReelceiver = [];
    var decodingReelceiverUuid = '';
    var receiversValues = helper.getNestedProperties(tag, 'radioDecodings.receivers.values');
    if(receiversValues !== undefined) {

      // For each receivers, we construct an array for the _links section
      // and we add links to the receivers section (in the tag response)
      _.each(receiversValues, function(receiver) {
        var uuid = receiver.uuid;
        if(uuid) {
          decodingReelceiverUuid += receiver.uuid + ',';
          var reelceiverUri = responseLinks.toAbsolute('/reelceivers/' + uuid, req, true);
          // We add the uri for the receivers section
          receiver.uri = {
            reelceiver: reelceiverUri
          };

          // _links section
          var linksReelceiver = _.clone(reelceiverUri);
          linksReelceiver.title = receiver.uuid;
          decodingReelceiver.push(linksReelceiver);
        }
      });
      // Remove the last comma
      var lastCharIsComma = decodingReelceiverUuid.charAt(decodingReelceiverUuid.length-1) === ',';
      if(lastCharIsComma) {
        decodingReelceiverUuid = decodingReelceiverUuid.slice(0, -1);
      }
    }

    result._meta  = {};
    result._links = {};

    // Metadata handling
    result._meta            = new responseMeta.Ok();
    result._meta.totalCount = 1;

    // Links handling
    var reelceiversUrl = '/reelceivers/';
    var howisUrl       = responseLinks.toAbsolute('/ask/howis', req, true);
    var whatAtUrl      = responseLinks.toAbsolute('/ask/whatat', req, true);

    result._links      = responseLinks.setDefault(req);
    result._links.tags = responseLinks.toAbsolute('/tags', req, true);

    if(poi !== undefined) {
      result._links.poi       = responseLinks.toAbsolute(reelceiversUrl + poi, req, true);
      result._links.poi.title = poi;
      result._links.howIsPoi  = _.clone(howisUrl);
      result._links.howIsPoi.href += '?uuid=' + poi;
      result._links.whatAtPoi = _.clone(whatAtUrl);
      result._links.whatAtPoi.href += '?uuid=' + poi;
    }
    if(prevPoi !== undefined) {
      result._links.prevPoi       = responseLinks.toAbsolute(reelceiversUrl + prevPoi, req, true);
      result._links.prevPoi.title = prevPoi;
      result._links.howIsPrevPoi  = _.clone(howisUrl);
      result._links.howIsPrevPoi.href += '?uuid=' + prevPoi;
      result._links.whatAtPrevPoi = _.clone(whatAtUrl);
      result._links.whatAtPrevPoi.href += '?uuid=' + prevPoi;
    }
    if(decodingReelceiver.length >= 0) {
      result._links.decodingReelceiver = decodingReelceiver;
      if(decodingReelceiverUuid !== '') {
        result._links.howAreDecodingReelceivers = _.clone(howisUrl);
        result._links.howAreDecodingReelceivers.href += '?uuid=' + decodingReelceiverUuid;
        result._links.whatAtDecodingReelceivers = _.clone(whatAtUrl);
        result._links.whatAtDecodingReelceivers.href += '?uuid=' + decodingReelceiverUuid;
      }
    }

    res.json(result);
    return next();
  }
};

module.exports = tagController;