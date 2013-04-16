var device = require('../models/device');
var pagination = require('../utils/pagination');

var helper = require('../utils/helper');

/**
 * Find all devices
 */
function findDevices(req, res, next) {
  device.findDevices(req.params, function devicesFound(err, result) {
    if(err) {
      return next(err);
    }

    res.json(200, result);
    return next();
  });
}

/**
 * Proceed a find request
 */
function findDeviceRequest(req, res, next) {
  device.findDeviceRequest(req.params.id, function deviceFound(err, device) {
    if(err) {
      return next(err);
    }
    res.json(200, { code: 200, message: 'Device # ' + device.id + ' found !' });
    return next();
  });
}

/**
 * Locate a device
 */
function location(req, res, next) {
  device.location(req.params.id, function deviceLocated(err, device) {
    if(err) {
      return next(err);
    }
    res.json(200, { code: 200, message: 'Device # ' + device.id + ' found in ' + device.location + '!'});
    return next();
  });
}

exports.findDevices = findDevices;
exports.findDeviceRequest = findDeviceRequest;
exports.location = location;