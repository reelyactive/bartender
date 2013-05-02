var restify = require('restify');
var _ = require('underscore');
var Tag = require('mongoose').model('Tag');

var paginator = require('../utils/paginator');
var apiResponse = require('../utils/apiResponse');

var AskModel = {
  /**
   * Fake DB for devices
   */
  // Point of interest
  pi: [
    {
      mac: '00-00-00-01',
      name: 'Rouen'
    },
    {
      mac: '00-00-00-02',
      name: 'Montréal'
    },
    {
      mac: '00-00-00-03',
      name: 'Paris'
    },
    {
      mac: '00-00-00-04',
      name: 'Toronto'
    },
    {
      mac: '00-00-00-05',
      name: 'San Francisco'
    }
  ],

  tags: [
    {
      mac: '00-10-00-57',
      location: '00-00-00-02'
    },
    {
      mac: '00-16-00-31',
      location: '00-00-00-01'
    },
    {
      mac: '00-ff-ff-54',
      location: '00-00-00-02'
    },
    {
      mac: '11-13-45-ed',
      location: '00-00-00-03'
    },
    {
      mac: '02-78-99-f1',
      location: '00-00-00-02'
    }
  ],

  whatAt: function(req, cb) {
    var params = req.params;
    var offset = params.offsest;
    var limit = params.limit;

    var pointInterests = params.macs.split(',');
    var results = [];
    for (var i = 0, l = pointInterests.length; i < l; i++) {
      var pointInterest = pointInterests[i];
      var result = {};
      result.mac = pointInterest;
      result.devices = [];
      for(var j = 0, length = this.tags.length; j < length; j++) {
        var tag = this.tags[j];
        if(tag.location === pointInterest) {
          result.devices.push(tag);
        }
      }
      result._count = result.devices.length;
      results.push(result);
    };

    // var result = results.slice(offset, limit);

    var total = results.length;
    var paginationResult = {
      pagination: {
        offset: offset,
        limit: limit,
        total: total
      },
      _macs: pointInterests,
      results: results
    };

    return cb(null, paginationResult);
  },

  whereIs: function(req, cb) {
    // Get params
    var params = req.params;
    var macs = params.macs.split(',');
    var offset = params.offset;
    var limit = params.limit;

    var totalCount = macs.length;

    // Instantiate returnObject
    var returnObject = {};

    // Metadata handling
    returnObject._metadata = apiResponse.ok();
    returnObject._metadata.totalCount = totalCount;
    returnObject._metadata.offset = offset;
    returnObject._metadata.limit = limit;

    // Links handling
    var urlBase = 'api/v0/ask/whereis';
    var macsUrl = '?macs=' + params.macs;
    var url = urlBase + macsUrl;
    returnObject._links = paginator.createLinks(url, offset, limit, totalCount);

    macs = macs.slice(offset, offset + limit);

    // Business logic
    returnObject.locations = [];

    Tag
      .where('type').equals('Tag')
      .where('mac').in(macs)
      .exec(function tagsFoundDB(err, tags) {
        if(err) {
          return cb(err);
        }
        var result;
        var unmatchedMacs = macs;
        for(var i = 0, l = tags.length; i < l; i++) {
          result = {};
          var tag = tags[i];
          result = tag;
          returnObject.locations.push(result);
          unmatchedMacs = _.without(unmatchedMacs, tag.mac);
        }
        returnObject.matched = _.difference(macs, unmatchedMacs);
        returnObject.unmatched = unmatchedMacs;

        if(returnObject.matched.length === 0) {
          return cb(new restify.ResourceNotFoundError(
            'No tags located')
          );
        }
        return cb(null, returnObject);
    });
  }
};

module.exports = AskModel;