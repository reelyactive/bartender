/**
 * Main router
 * His goal is to load every subroutes of our API
 * and give them to the server.
 * @param  {Object} server  Instance of restify server
 * @param  {String} version Current version of the API
 */
module.exports = function(server, version) {
  require('./entry')(server, version);
  require('./tag')(server, version);
  require('./mgmt')(server, version);
  require('./ask')(server, version);
};