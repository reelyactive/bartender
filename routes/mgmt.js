var restify = require('restify');
var mgmtController = require('../controllers/mgmt');

module.exports = function(server, VERSION) {
  server.get(VERSION + '/mgmt/tag/dropCollection', mgmtController.dropDeviceCollection);
  server.get(VERSION + '/mgmt/tag/generate', mgmtController.generateDevices);
};