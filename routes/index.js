module.exports = function(server) {
  require('./entry')(server);
  require('./device')(server);
  require('./ask')(server);
};