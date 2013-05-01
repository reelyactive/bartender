module.exports = function(server, VERSION) {
  require('./account')(server, VERSION);
  require('./entry')(server, VERSION);
  require('./tag')(server, VERSION);
  require('./mgmt')(server, VERSION);
  require('./ask')(server, VERSION);
};