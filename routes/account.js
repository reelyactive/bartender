var accountController = require('../controllers/account');
var policies = require('../policies/account/account');

module.exports = function(server, VERSION) {
  server.get(VERSION + '/accounts/:accountUid/devices/:deviceUid',
    policies.requireParams, accountController.findDevice);

  server.get(VERSION + '/accounts/:accountUid/devices/:deviceUid/location',
    policies.requireParams, accountController.findDeviceLocation);

  server.get(VERSION + '/accounts/:accountUid/devices/:deviceUid/sensors',
    policies.requireParams, accountController.findDeviceSensors);
};