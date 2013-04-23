// var accountModel = require('../models/account');
var deviceModel = require('../models/device');

var AccountController = {
  /**
   * Proceed a find request
   */
  findDevice: function(req, res, next) {
    var accountUid = req.params.accountUid || 0;
    var deviceUid = req.params.deviceUid || 0;

    deviceModel.findDeviceRequest(deviceUid, function deviceFound(err, device) {
      if(err) {
        return next(err);
      }
      res.json(200, {
        'account': accountUid,
        'device': device
      });
      return next();
    });
  },

  findDeviceLocation: function(req, res, next) {
    var accountUid = req.params.accountUid || 0;
    var deviceUid = req.params.deviceUid || 0;

    deviceModel.findDeviceRequest(deviceUid, function deviceFound(err, device) {
      if(err) {
        return next(err);
      }
      res.json(200, {
        location: device.location
      });
      return next();
    });
  },

  findDeviceSensors: function(req, res, next) {
    var accountUid = req.params.accountUid || 0;
    var deviceUid = req.params.deviceUid || 0;

    deviceModel.findDeviceRequest(deviceUid, function deviceFound(err, device) {
      if(err) {
        return next(err);
      }
      res.json(200, {
        sensors: device.sensors
      });
      return next();
    });
  }
};

module.exports = AccountController;