var restify = require('restify');

/**
 * Fake DB for devices
 */
var devices = [
  {
    id: '00-10-00-57',
    location: 'Rouen'
  },
  {
    id: '00-16-00-31',
    location: 'Montréal'
  },
  {
    id: '00-ff-ff-54',
    location: 'Paris'
  },
  {
    id: '11-13-45-ed',
    location: 'Toronto'
  },
  {
    id: '02-78-99-f1',
    location: 'San Francisco'
  }
];

/**
 * Find a device
 */
var findDevice = function(id, cb) {
  for(var i =0, l = devices.length; i < l; i++) {
    if(devices[i].id === id) {
      return cb(null, devices[i]);
    }
  }
  return cb(new restify.ResourceNotFoundError('No device  with id ' + id + ' found'));
};

/**
 * Find all devices
 */
function findDevices(params, cb) {
  var pagination = params.pagination;
  var offset = pagination.offset;
  var limit = pagination.limit;
  var result = devices.slice(offset, limit);

  if(result.length === 0) {
    return cb(new restify.ResourceNotFoundError('No devices found'));
  }
  var total = devices.length;
  var paginationResult = {
    pagination: {
        offset: offset,
        limit: limit,
        total: total
    },
    result: result
  }
  return cb(null, paginationResult);
}

/**
 * Proceed a find request
 */
function findDeviceRequest(id, cb) {
  findDevice(id, function deviceFound(err, device) {
    if(err) {
      return cb(err);
    }
    return cb(null, device);
  });
}

/**
 * Locate a device
 */
function location(id, cb) {
  findDevice(id, function deviceFound(err, device) {
    if(err) {
      return cb(err);
    }
    return cb(null, device);
  });
}

exports.findDevices = findDevices;
exports.findDeviceRequest = findDeviceRequest;
exports.location = location;