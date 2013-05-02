/**
 * Router for tag ressource
 */

var tagController = require('../controllers/tag');
var policies = require('../policies/common');

module.exports = function(server, version) {
  server.get(version + '/tags', policies.paginate, tagController.findTags);

  server.get(version + '/tags/visible',
    policies.paginate, tagController.findTagsVisible);

  server.get(version + '/tags/invisible',
    policies.paginate, tagController.findTagsInvisible);

  server.get(version + '/tags/:id',
    policies.requireId, tagController.findTag);
};