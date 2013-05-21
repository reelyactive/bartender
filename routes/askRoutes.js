/**
 * Router for the ask routes
 */

var askController = require('../controllers/askController');
var policies = require('../policies/common');

// Combination of multiple policies
var policiesAsk = [policies.requireMacs, policies.paginate];

module.exports = function(server, version) {
  server.get(version + '/ask'         , askController.root);
  server.get(version + '/ask/whatat'  , policiesAsk, askController.whatAt);
  server.get(version + '/ask/whereis' , policiesAsk, askController.whereIs);
  server.get(version + '/ask/howis'   , policiesAsk, askController.howIs);
};