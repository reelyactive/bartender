var restify = require('restify');
var mgmtController = require('../controllers/mgmt');

module.exports = function(server, VERSION) {
  server.get(VERSION + '/mgmt/tag/dropCollection', mgmtController.dropTagCollection);
  server.get(VERSION + '/mgmt/tag/generate', mgmtController.generateTags);
};