var deviceModel = require('../models/device');

var DeviceController = {
  /**
   * Find all devices
   */
  findDevices: function(req, res, next) {
    deviceModel.findDevices(req.params, function devicesFound(err, result) {
      if(err) {
        return next(err);
      }

      res.json(200, result);
      return next();
    });
  },

  /**
   * Proceed a find request
   */
  findDeviceRequest: function(req, res, next) {
    deviceModel.findDeviceRequest(req.params.id, function deviceFound(err, device) {
      if(err) {
        return next(err);
      }
      res.json(200, { code: 200, message: 'Device # ' + device.id + ' found !' });
      return next();
    });
  },

  /**
   * Locate a device
   */
  location: function(req, res, next) {
    deviceModel.location(req.params.id, function deviceLocated(err, device) {
      if(err) {
        return next(err);
      }
      res.json(200, { code: 200, message: 'Device # ' + device.id + ' found in ' + device.location + '!'});
      return next();
    });
  }
};

module.exports = DeviceController;