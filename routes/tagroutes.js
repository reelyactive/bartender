/**
 * Router for tag ressource
 */

var tagController = require('../controllers/tagcontroller');
var policies      = require('../policies/common');

module.exports = function(server, version) {
  server.get(version + '/tags',
    policies.paginate, tagController.findTags);

  server.get(version + '/tags/:id',
    policies.requireId, tagController.findTag);
};