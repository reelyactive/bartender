var ask = require('../controllers/ask');
var policies = require('../policies/common');

module.exports = function(server) {
  server.get('/ask/whatat/:id', policies.requireId, policies.paginate, ask.whatAt);
  server.get('/ask/whereis/:id', policies.requireId, ask.whereIs);
};