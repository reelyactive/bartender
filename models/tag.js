var restify = require('restify');
var Tag = require('mongoose').model('Tag');

var paginator = require('../utils/paginator');

var TagModel = {

  /**
   * Find all tags
   */
  findTags: function(req, cb) {
    // Get params
    var params = req.params;
    var offset = params.offset;
    var limit = params.limit;
    var totalCount = 0;

    // Instantiate returnObject
    var returnObject = {};
    returnObject._metadata = {};
    returnObject._links = {};

    // Metadata handling
    returnObject._metadata.statusCode = 200;
    returnObject._metadata.message = 'ok';
    returnObject._metadata.developerMessage = 'ok';
    returnObject._metadata.userMessage = 'ok';
    returnObject._metadata.errorCode = null;
    returnObject._metadata.moreInfo = 'ok';
    returnObject._metadata.offset = offset;
    returnObject._metadata.limit = limit;

    // Links handling
    var urlBase = 'api/v0/tags';
    var url = urlBase;

    // Business logic
    Tag.find({
      type: 'Tag'
    }, function tagsFound(err, tags) {
      if(err) {
        return cb(err);
      }
      if(!tags) {
          return cb(new restify.ResourceNotFoundError(
            'No tags found'));
        }
        totalCount = tags.length;
        returnObject._metadata.totalCount = totalCount;
        returnObject.tags = tags;

        returnObject._links = paginator.createLinks(url, offset, limit, totalCount);

        return  cb(null, returnObject);
    });
  },

  /**
   * Find a tag based on his id
   */
  findTag: function(id, cb) {
    // Instantiate returnObject
    var returnObject = {};
    returnObject._metadata = {};
    returnObject._links = {};

    // Metadata handling
    returnObject._metadata.statusCode = 200;
    returnObject._metadata.message = 'ok';
    returnObject._metadata.developerMessage = 'ok';
    returnObject._metadata.userMessage = 'ok';
    returnObject._metadata.errorCode = null;
    returnObject._metadata.moreInfo = 'ok';

    // Links handling
    var urlBase = 'api/v0/tags/' + id;
    var url = urlBase;

    // Business logic
    Tag.findOne({
        type: 'Tag',
        mac: id
      }, function tagFound(err, tag) {
        if(err) {
          return cb(err);
        }
        if(!tag) {
          return cb(new restify.ResourceNotFoundError('No tag  with id ' + id + ' found'));
        }
        returnObject.tag = tag;

        return  cb(null, returnObject);
    });
  },

  /**
   * Find tags based on their visibility
   */
  findTagsByVisibility: function(visibility, req, cb) {
    // Get params
    var params = req.params;
    var offset = params.offset;
    var limit = params.limit;
    var totalCount = 0;

    // Instantiate returnObject
    var returnObject = {};
    returnObject._metadata = {};
    returnObject._links = {};
    returnObject.tags = [];

    // Metadata handling
    returnObject._metadata.statusCode = 200;
    returnObject._metadata.message = 'ok';
    returnObject._metadata.developerMessage = 'ok';
    returnObject._metadata.userMessage = 'ok';
    returnObject._metadata.errorCode = null;
    returnObject._metadata.moreInfo = 'ok';
    returnObject._metadata.totalCount = totalCount;
    returnObject._metadata.offset = offset;
    returnObject._metadata.limit = limit;

    // Links handling
    var urlBase = 'api/v0/tags/' + visibility;
    var url = urlBase;

    // Business logic
    Tag
      .where('type').equals('Tag')
      .where('visibility.value').equals(visibility)
      .exec(function tagsFoundDB(err, tags) {
        if(err) {
          return cb(err);
        }
        if(!tags) {
          return cb(new restify.ResourceNotFoundError(
            'No tags found for visibility: ' + visibility));
        }
        totalCount = tags.length;
        returnObject._metadata.totalCount = totalCount;
        returnObject.tags = tags;

        returnObject._links = paginator.createLinks(url, offset, limit, totalCount);

        return  cb(null, returnObject);
    });
  }
};

module.exports = TagModel;