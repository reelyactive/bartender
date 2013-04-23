module.exports = function(server, VERSION) {
  require('./account')(server, VERSION);
  require('./entry')(server, VERSION);
  require('./device')(server, VERSION);
  require('./ask')(server, VERSION);
};