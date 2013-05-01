var restify = require('restify');

var TagModel = {
  /**
   * Fake DB for tags
   */
  tags: [
    {
      id: '00-10-00-57',
      location: 'Rouen',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    },
    {
      id: '00-16-00-31',
      location: 'Montréal',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    },
    {
      id: '00-ff-ff-54',
      location: 'Paris',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    },
    {
      id: '11-13-45-ed',
      location: 'Toronto',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    },
    {
      id: '02-78-99-f1',
      location: 'San Francisco',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    }
  ],

  /**
   * Find a tag
   */
  findTag: function(id, cb) {
    for(var i =0, l = this.tags.length; i < l; i++) {
      if(this.tags[i].id === id) {
        return cb(null, this.tags[i]);
      }
    }
    return cb(new restify.ResourceNotFoundError('No tag  with id ' + id + ' found'));
  },

  /**
   * Find all tags
   */
  findTags: function(params, cb) {
    var offset = params.offset;
    var limit = params.limit;
    var result = this.tags.slice(offset, limit);

    if(result.length === 0) {
      return cb(new restify.ResourceNotFoundError('No tags found'));
    }
    var total = this.tags.length;
    var paginationResult = {
      pagination: {
          offset: offset,
          limit: limit,
          total: total
      },
      result: result
    }
    return cb(null, paginationResult);
  },

  /**
   * Proceed a find request
   */
  findTagRequest: function(id, cb) {
    this.findTag(id, function tagFound(err, tag) {
      if(err) {
        return cb(err);
      }
      return cb(null, tag);
    });
  }
};

module.exports = TagModel;