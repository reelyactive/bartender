var account = require('../controllers/account');
var policies = require('../policies/account/account');

module.exports = function(server) {
  server.get('/accounts/:accountUid/devices/:deviceUid',
    policies.requireParams, account.findDevice);
  server.get('/accounts/:accountUid/devices/:deviceUid/location',
    policies.requireParams, account.findDeviceLocation);
  server.get('/accounts/:accountUid/devices/:deviceUid/sensors',
    policies.requireParams, account.findDeviceSensors);
};