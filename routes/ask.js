var askController = require('../controllers/ask');
var policies = require('../policies/common');

var policiesAsk = [policies.requireMacs, policies.paginate];


module.exports = function(server, VERSION) {
  server.get(VERSION + '/ask/', askController.root);

  server.get(VERSION + '/ask/whatat', policiesAsk, askController.whatAt);

  server.get(VERSION + '/ask/whereis', policiesAsk, askController.whereIs);
};