/**
 * Called before the tests are launched
 * His goal is to launch the restify server
 */
before(function(done) {
  require('../server');
  done();
});