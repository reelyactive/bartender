var restify = require('restify');

/**
 * Fake DB for devices
 */
var pointInterests = [
  {
    id: '00-00-00-01',
    name: 'Rouen'
  },
  {
    id: '00-00-00-02',
    name: 'Montréal'
  },
  {
    id: '00-00-00-03',
    name: 'Paris'
  },
  {
    id: '00-00-00-04',
    name: 'Toronto'
  },
  {
    id: '00-00-00-05',
    name: 'San Francisco'
  }
];

var tags = [
  {
    id: '00-10-00-57',
    location: '00-00-00-02'
  },
  {
    id: '00-16-00-31',
    location: '00-00-00-01'
  },
  {
    id: '00-ff-ff-54',
    location: '00-00-00-02'
  },
  {
    id: '11-13-45-ed',
    location: '00-00-00-03'
  },
  {
    id: '02-78-99-f1',
    location: '00-00-00-02'
  }
];

function whatAt(params, cb) {
  var pagination = params.pagination;
  var offset = pagination.offset;
  var limit = pagination.limit;

  var pointInterests = params.uids.split(',');
  var results = [];
  for (var i = 0, l = pointInterests.length; i < l; i++) {
    var pointInterest = pointInterests[i];
    var result = {};
    result.id = pointInterest;
    result.devices = [];
    for(var j = 0, length = tags.length; j < length; j++) {
      var tag = tags[j];
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
    _uids: pointInterests,
    results: results
  };

  return cb(null, paginationResult);
};

function whereIs(tagUids, cb) {
  var returnValue = {};
  returnValue._unmatched = [];
  returnValue.results = [];

  var tagsRequest = tagUids.split(',');
  for(var i = 0, l = tagsRequest.length; i < l; i++) {
    var tagFound = null;
    var tagRequest = tagsRequest[i];
    var result = {};

    for(var j = 0, length = tags.length; j < length; j++) {
      var tag = tags[j];
      if(tag.id === tagRequest) {
        tagFound = tag;
        break;
      }
    }

    if(!tagFound) {
      returnValue._unmatched.push(tagRequest);
    } else {
      result.id = tagRequest;
      var piFound;
      for(var j = 0, length = pointInterests.length; j < length; j++) {
        var pointInterest = pointInterests[j];
        if(tagFound.location === pointInterest.id) {
          result.location = pointInterest;
          break;
        }
      }
      if(!result.location) {
        result.state = 'offline';
      } else {
        result.state = 'online';
      }
      returnValue.results.push(result);
    }
  }

  return cb(null, returnValue);
};

exports.whatAt = whatAt;
exports.whereIs = whereIs;