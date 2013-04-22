var account = require('../controllers/account');
var policies = require('../policies/account/account');

module.exports = function(server) {
  server.get('/accounts/:accountUid/devices/:deviceUid',
        policies.requireParams, account.find);
};