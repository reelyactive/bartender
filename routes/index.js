module.exports = function(server) {
  require('./account')(server);
  require('./entry')(server);
  require('./device')(server);
  require('./ask')(server);
};