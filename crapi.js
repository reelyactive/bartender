var barnOwl = require('barnowl');
var http = require('http');
var barnOwlInstance = new barnOwl();
var server = http.createServer();
var httpPort = process.env.httpport || 4000;
var udpPort = process.env.udpport || 49900;
var ipAddr = process.env.ipaddress || '127.0.0.1';
var staleMilliseconds = 10000;
var identifierTable = {};

//barnOwlInstance.bind('serial', '/dev/ttyUSB0');  // Linux
//barnOwlInstance.bind('serial', 'COM15');  // Windows
barnOwlInstance.bind('udp', ipAddr +':' + udpPort);

/* Just chuck the visibility event into an array where the keys are the */
/*   identifier values.                                                 */
barnOwlInstance.on('visibilityEvent', function(tiraid) {
  identifierTable[tiraid.identifier.value] = tiraid;
});

/* Web server which just looks for a list of macs and returns all       */
/*   identifier values which have a matching radioDecoding identifier.  */
server.on('request', function(req, res) {
  var macsIndex = req.url.indexOf("macs=");
  var hasMacs = macsIndex > 0;
  if(!hasMacs) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('The url should contain some macs');
  }
  else {
    var macs = req.url.substr(macsIndex + 5);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(getIdentifiers(macs.toLowerCase().split(',')));
  }
});

/* Search through the identifier table and return all identifiers which */
/*   have a radioDecoding from one of the specified macs.               */
function getIdentifiers(macs) {
  var matchingIdentifiers = [];
  var currentDate = new Date();
  for(identifier in identifierTable) {
    var tiraid = identifierTable[identifier];
    var strongestRadioDecoding = tiraid.radioDecodings[0];
    if(strongestRadioDecoding.identifier) {
      var mac = strongestRadioDecoding.identifier.value;
      var hasMac = macs.indexOf(mac) > -1;
      var lastTimestamp = tiraid.timestamp;
      var diff = currentDate - Date.parse(lastTimestamp); // in milliseconds 
      if(hasMac && diff < staleMilliseconds) {
        //matchingIdentifiers.push(identifier);
        matchingIdentifiers.push(tiraid);
      }
    }
  }
  //return matchingIdentifiers.toString();
  return JSON.stringify(matchingIdentifiers, null, " ");
}

/* Listen on port 4000 */
server.listen(httpPort);
