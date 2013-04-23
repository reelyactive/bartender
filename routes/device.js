var deviceController = require('../controllers/device');
var policies = require('../policies/common');

module.exports = function(server, VERSION) {
  server.get(VERSION + '/devices', policies.paginate, deviceController.findDevices);
  server.get(VERSION + '/devices/:id', policies.requireId, deviceController.findDeviceRequest);
  server.get(VERSION + '/devices/:id/location', policies.requireId, deviceController.location);
};