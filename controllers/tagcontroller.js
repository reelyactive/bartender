var _                   = require('underscore');
var Tag                 = require('../models/tag');
var responseBoilerplate = require('../utils/responseboilerplate');
var responseMeta        = responseBoilerplate.responseMeta;
var responseLinks       = responseBoilerplate.responseLinks;
var restify             = require('restify');
var paginator           = require('../utils/paginator');
var validator           = require('../utils/validator');
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
   * Find a specific tag
   */
  findTag: function(req, res, next) {
    // Get params
    var id = req.params.id;
    var conditions = {
      type: 'Tag'
    };
    if(validator.validateMac(id)) {
      conditions.mac = id;
    } else if(validator.validateUuid(id)) {
      conditions.uuid = id;
    }

    // Instantiate result
    var result = {};

    // Links handling
    var url = req.href();

    // Business logic
    Tag.findOne(conditions, function tagFound(err, tag) {
        if(err) {
          return next(err);
        }
        if(!tag) {
          var message = 'No tag  with id (uuid or mac) ' + id + ' found';
          result._meta = new responseMeta.NotFound(message);
          res.json(result._meta.statusCode, result);
          return next();
        }

        // Transform the mongoose model instance to a plain object
        tag    = tag.toObject();
        result = tag;

        // Add links in our object tag response
        if(tag.location && tag.location.poi && tag.location.poi.uuid) {
          var uuid = tag.location.poi.uuid;
          tag.location.poi.uri = {
            reelceiver: responseLinks.toAbsolute('/reelceivers/' + uuid, req, true)
          };
        }
        if(tag.location && tag.location.lastChangeEvent
          && tag.location.lastChangeEvent.poi && tag.location.lastChangeEvent.poi.uuid) {
          var uuid = tag.location.lastChangeEvent.poi.uuid;
          tag.location.lastChangeEvent.poi.uri = {
            reelceiver: responseLinks.toAbsolute('/reelceivers/' + uuid, req, true)
          };
        }

        result._meta   = {};
        result._links  = {};

        // Metadata handling
        result._meta            = new responseMeta.Ok();
        result._meta.totalCount = 1;

        // Tags values for generating links
        // todo href + title
        var poi;
        var prevPoi;
        if(tag.location) {
          if(tag.location.poi && tag.location.poi.uuid) {
            poi = tag.location.poi.uuid;
          }
          if(tag.location.lastChangeEvent && tag.location.lastChangeEvent.poi
            && tag.location.lastChangeEvent.poi.uuid) {
            prevPoi = tag.location.lastChangeEvent.poi.uuid;
          }
        }

        // Maybe we should pluralize this name as it's an array
        var decodingReelceiver = [];
        var decodingReelceiverUuid = '';
        if(tag.radioDecodings && tag.radioDecodings.receivers
          && tag.radioDecodings.receivers.values) {

          _.each(tag.radioDecodings.receivers.values, function(receiver) {
            var uuid = receiver.uuid;
            if(uuid) {
              decodingReelceiverUuid += receiver.uuid + ',';
              var reelceiverUri = responseLinks.toAbsolute('/reelceivers/' + uuid, req, true);
              receiver.uri = {
                reelceiver: reelceiverUri
              };
              decodingReelceiver.push(reelceiverUri);
            }
          });

          var lastCharIsComma = decodingReelceiverUuid.charAt(decodingReelceiverUuid.length-1) === ',';
          if(lastCharIsComma) {
            decodingReelceiverUuid = decodingReelceiverUuid.slice(0, -1);
          }
        }

        var reelceiversUrl = '/reelceivers/';
        var howisUrl       = responseLinks.toAbsolute('/ask/howis', req, true);
        var whatAtUrl      = responseLinks.toAbsolute('/ask/whatat', req, true);

        // Links handling
        result._links      = responseLinks.setDefault(req);
        result._links.tags = responseLinks.toAbsolute('/tags', req, true);

        if(poi) {
          result._links.poi       = responseLinks.toAbsolute(reelceiversUrl + poi, req, true);
          result._links.howIsPoi  = _.clone(howisUrl);
          result._links.howIsPoi.href += '?uuid=' + poi;
          result._links.whatAtPoi = _.clone(whatAtUrl);
          result._links.whatAtPoi.href += '?uuid=' + poi;
        }
        if(prevPoi) {
          result._links.prevPoi       = responseLinks.toAbsolute(reelceiversUrl + prevPoi, req, true);
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
    );
  }
};

module.exports = tagController;