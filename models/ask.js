var restify = require('restify');
var paginator = require('../utils/paginator');

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

  whatAt: function(params, cb) {
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

  whereIs: function(params, cb) {
    // Get params
    var macs = params.macs.split(',');
    var offset = params.offset;
    var limit = params.limit;

    var totalCount = macs.length;

    // Instantiate returnObject
    var returnObject = {};
    returnObject._metadata = {};
    returnObject._links = {};
    returnObject.unmatched = [];
    returnObject.locations = [];

    // Metadata handling
    returnObject._metadata.statusCode = 200;
    returnObject._metadata.message = 'ok;'
    returnObject._metadata.developerMessage = 'ok';
    returnObject._metadata.userMessage = 'ok';
    returnObject._metadata.errorCode = null;
    returnObject._metadata.moreInfo = 'ok';
    returnObject._metadata.totalCount = totalCount;
    returnObject._metadata.offset = offset;
    returnObject._metadata.limit = limit;

    // Links handling
    var urlBase = 'api/v0/ask/whereis';
    var macsUrl = '/?macs=' + params.macs;
    var url = urlBase + macsUrl;
    returnObject._links = paginator.createLinks(url, offset, limit, totalCount);

    // Business logic
    for(var i = 0, l = macs.length; i < l; i++) {
      var deviceFound = null;
      var mac = macs[i];
      var result = {};

      for(var j = 0, length = this.tags.length; j < length; j++) {
        var tag = this.tags[j];
        if(tag.mac === mac) {
          deviceFound = tag;
          break;
        }
      }

      if(!deviceFound) {
        returnObject.unmatched.push(mac);
      } else {
        result.mac = mac;
        var piFound;
        for(var j = 0, length = this.pi.length; j < length; j++) {
          var pointInterest = this.pi[j];
          if(deviceFound.location === pointInterest.mac) {
            piFound = pointInterest;
            break;
          }
        }
        result.location = {};
        result.location.modelUid = 'FF-FF-FF-FF';
        result.location.modelName = 'rAStrongestReelceiver';
        result.location.lastUpdate = 'todo';
        result.location.lastChangeEvent = {'to': 'do'};
        result.location.values = {};
        if(!piFound) {
          result.location.values.visibility = 'offline';
        } else {
          result.location.values.reelceiverMac = piFound.mac;
          result.location.values.visibility = 'online';
        }
        returnObject.locations.push(result);
      }
    }

    return cb(null, returnObject);
  }
};

module.exports = AskModel;