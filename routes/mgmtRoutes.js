/**
 * Router for management purposes
 * (only required during development phase)
 */
var mgmtController = require('../controllers/mgmtController');

module.exports = function(server, version) {
  server.get(version + '/mgmt/tag/dropCollection' , mgmtController.dropDeviceCollection);
  server.get(version + '/mgmt/tag/generate'       , mgmtController.generateDevices);
};