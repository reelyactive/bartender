var device = require('../controllers/device');
var policies = require('../policies/common');

module.exports = function(server) {
  server.get('/devices', policies.paginate, device.findDevices);
  server.get('/devices/:id', policies.requireId, device.findDeviceRequest);
  server.get('/devices/:id/location', policies.requireId, device.location);
};