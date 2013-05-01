var accountController = require('../controllers/account');
var policies = require('../policies/account/account');

module.exports = function(server, VERSION) {
  server.get(VERSION + '/accounts/:accountUid/tags/:tagUid',
    policies.requireParams, accountController.findTag);
};