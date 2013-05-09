/**
 * Router for the entry point
 * His goal his to answer to requests made on
 * the entry point of the API
 */
var entryController = require('../controllers/entry');

module.exports = function(server) {
  server.get('/'         , entryController.root);
  server.get('/404'      , entryController.notFound);
  server.get('/:version' , entryController.version);
};