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

  var pointInterest = params.id;

  var results = [];
  for(var i = 0, l = tags.length; i < l; i++) {
    var tag = tags[i];
    if(tag.location == pointInterest) {
      results.push(tag);
    }
  }

  var result = results.slice(offset, limit);
  if(result.length === 0) {
    // 200 here
    return cb(new restify.ResourceNotFoundError('No point of interest with id ' + params.id + ' found'));
  }

  var total = results.length;
  var paginationResult = {
    pagination: {
        offset: offset,
        limit: limit,
        total: total
    },
    result: result
  }

  return cb(null, paginationResult);
};

function whereIs(tagId, cb) {
  var tagFound;

  var results = [];
  for(var i = 0, l = tags.length; i < l; i++) {
    var tag = tags[i];
    if(tag.id == tagId) {
      tagFound = tag;
      break;
    }
  }
  if(!tagFound) {
    return cb(new restify.ResourceNotFoundError('Device with id ' + tagId + ' isn\'t existing.'));
  } else {
    var piFound;
    for(var i = 0, l = pointInterests.length; i < l; i++) {
      var pointInterest = pointInterests[i];
      if(tag.location == pointInterest.id) {
        piFound = pointInterest;
      }
    }
    if(!piFound) {
      return cb(new restify.ResourceNotFoundError('This device can\'t be located.'));
    } else {
      return cb(null, piFound);
    }
  }
};

exports.whatAt = whatAt;
exports.whereIs = whereIs;