var ask = require('../controllers/ask');
var policies = require('../policies/common');

module.exports = function(server) {
  server.get('/ask/whatat', policies.requireUids, policies.paginate, ask.whatAt);
  server.get('/ask/whereis', policies.requireUids, ask.whereIs);
};