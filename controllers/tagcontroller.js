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
    var favoriteType;
    if(validator.validateMac(id)) {
      searchFilters.mac = id;
      favoriteType = 'mac';
    } else if(validator.validateUuid(id)) {
      searchFilters.uuid = id;
      favoriteType = 'uuid';
    }

    // Business logic
    Tag.findOne(searchFilters, function tagFound(err, tag) {
      if(err) {
        return next(err);
      }
      if(!tag) {
        var message = 'No tag  with ' + favoriteType + ' = ' + id + ' found';
        var result  = {
          _meta: new responseMeta.NotFound(message)
        };
        res.json(result._meta.statusCode, result);
        return next();
      }

      // Transform the mongoose model instance to a plain object
      tag = tag.toObject();
      tagController.tagFound(tag, favoriteType, req, res, next);
    });
  },

  /**
   * Called when a tag is found
   * Linked to findTag above
   */
  tagFound: function(tag, favoriteType,  req, res, next) {
    // Remove unwanted attributes from mongo
    delete tag._id;
    delete tag.__v;

    var result    = {};
    result._meta  = {};
    result._links = {};
    result = _.extend(result, tag);


    // Add links in our object tag response
    var poi = helper.getNestedProperties(tag, 'location.poi.' + favoriteType);
    if(poi !== undefined) {
      tag.location.poi.uri = {
        reelceiver: responseLinks.toAbsolute('/reelceivers/' + poi, req, true)
      };
      tag.location.poi.uri.reelceiver.title = 'Point of interest where this tag is located';
    }
    var prevPoi = helper.getNestedProperties(tag, 'location.lastChangeEvent.poi.' + favoriteType);
    if(prevPoi !== undefined) {
      tag.location.lastChangeEvent.poi.uri = {
        reelceiver: responseLinks.toAbsolute('/reelceivers/' + prevPoi, req, true)
      };
      tag.location.lastChangeEvent.poi.uri.reelceiver.title = 'Previous point of interest where this tag was located';
    }

    // Maybe we should pluralize this name as it's an array
    var decodingReelceiver = [];
    var decodingReelceiverId = '';
    var receiversValues = helper.getNestedProperties(tag, 'radioDecodings.receivers.values');
    if(receiversValues !== undefined) {

      // For each receivers, we construct an array for the _links section
      // and we add links to the receivers section (in the tag response)
      _.each(receiversValues, function(receiver) {
        var id = receiver[favoriteType];
        if(id) {
          decodingReelceiverId += id + ',';
          var reelceiverUri = responseLinks.toAbsolute('/reelceivers/' + id, req, true);

          // _links section
          var linksReelceiver   = _.clone(reelceiverUri);
          linksReelceiver.name  = favoriteType === 'mac' ? receiver.uuid : receiver.mac;
          linksReelceiver.title = 'One of the reelceiver which decoded this tag';
          decodingReelceiver.push(linksReelceiver);

          // We add the uri for the receivers section
          receiver.uri = {
            reelceiver: reelceiverUri
          };
          receiver.uri.reelceiver.title = 'One of the reelceiver which decoded this tag';
        }
      });
      // Remove the last comma
      var lastCharIsComma = decodingReelceiverId.charAt(decodingReelceiverId.length-1) === ',';
      if(lastCharIsComma) {
        decodingReelceiverId = decodingReelceiverId.slice(0, -1);
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

    var links        = responseLinks.setDefault(req);
    links.self.title = 'The tag himself';
    links.tags       = responseLinks.toAbsolute('/tags', req, true);
    links.tags.title = 'The tags resource. Return all the tags you have access to';

    // Pluralize for the _links generation
    favoriteType += 's';

    if(poi !== undefined) {
      links.poi       = responseLinks.toAbsolute(reelceiversUrl + poi, req, true);
      links.poi.title = 'Point of interest where this tag is located';
      links.howIsPoi  = _.clone(howisUrl);
      links.howIsPoi.href += '?' + favoriteType + '=' + poi;
      links.howIsPoi.title = 'Know how is the point of interest where this tag is located';
      links.whatAtPoi = _.clone(whatAtUrl);
      links.whatAtPoi.href += '?' + favoriteType + '=' + poi;
      links.whatAtPoi.title = 'Find what at the point of interest where this tag is located';
    }
    if(prevPoi !== undefined) {
      links.prevPoi       = responseLinks.toAbsolute(reelceiversUrl + prevPoi, req, true);
      links.prevPoi.title = 'Previous point of interest where this tag was located';
      links.howIsPrevPoi  = _.clone(howisUrl);
      links.howIsPrevPoi.href += '?' + favoriteType + '=' + prevPoi;
      links.howIsPrevPoi.title = 'Know how is the previous point of interest where this tag was located';
      links.whatAtPrevPoi = _.clone(whatAtUrl);
      links.whatAtPrevPoi.href += '?' + favoriteType + '=' + prevPoi;
      links.whatAtPrevPoi.title = 'Find what at the previous point of interest where this tag was located';
    }
    if(decodingReelceiver.length >= 0) {
      links.decodingReelceiver = decodingReelceiver;
      if(decodingReelceiverId !== '') {
        links.howAreDecodingReelceivers = _.clone(howisUrl);
        links.howAreDecodingReelceivers.href  += '?' + favoriteType + '=' + decodingReelceiverId;
        links.howAreDecodingReelceivers.title = 'Know how are the reelceivers which decoded this tag';
        links.whatAtDecodingReelceivers = _.clone(whatAtUrl);
        links.whatAtDecodingReelceivers.href += '?' + favoriteType + '=' + decodingReelceiverId;
        links.whatAtDecodingReelceivers.title = 'Find what is located at the reelceivers which decoded this tag';
      }
    }

    result._links = links;

    res.json(result);
    return next();
  }
};

module.exports = tagController;