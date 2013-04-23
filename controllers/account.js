// var account = require('../models/account');
var device = require('../models/device');

/**
 * Proceed a find request
 */
function findDevice(req, res, next) {
  var accountUid = req.params.accountUid || 0;
  var deviceUid = req.params.deviceUid || 0;

  device.findDeviceRequest(deviceUid, function deviceFound(err, device) {
    if(err) {
      return next(err);
    }
    res.json(200, {
      'account': accountUid,
      'device': device
    });
    return next();
  });
}

function findDeviceLocation(req, res, next) {
  var accountUid = req.params.accountUid || 0;
  var deviceUid = req.params.deviceUid || 0;

  device.findDeviceRequest(deviceUid, function deviceFound(err, device) {
    if(err) {
      return next(err);
    }
    res.json(200, {
      location: device.location
    });
    return next();
  });
}

function findDeviceSensors(req, res, next) {
  var accountUid = req.params.accountUid || 0;
  var deviceUid = req.params.deviceUid || 0;

  device.findDeviceRequest(deviceUid, function deviceFound(err, device) {
    if(err) {
      return next(err);
    }
    res.json(200, {
      sensors: device.sensors
    });
    return next();
  });
}


exports.findDevice = findDevice;
exports.findDeviceLocation = findDeviceLocation;
exports.findDeviceSensors = findDeviceSensors;