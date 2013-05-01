var tagController = require('../controllers/tag');
var policies = require('../policies/common');

module.exports = function(server, VERSION) {
  server.get(VERSION + '/tags', policies.paginate, tagController.findTags);

  server.get(VERSION + '/tags/visible',
    policies.paginate, tagController.findTagsVisible);

  server.get(VERSION + '/tags/invisible',
    policies.paginate, tagController.findTagsInvisible);

  server.get(VERSION + '/tags/:id',
    policies.requireId, tagController.findTag);
};