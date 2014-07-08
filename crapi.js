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
  var findIndex = req.url.indexOf("find=");
  var hasMacs = macsIndex > 0;
  var hasFind = findIndex > 0;
  if(!(hasMacs || hasFind)) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('The url should contain macs= or find=');
  }
  else if(hasMacs) {
    var macs = req.url.substr(macsIndex + 5);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(getIdentifiers(macs.toLowerCase().split(',')));
  }
  else if(hasFind) {
    var mac = req.url.substr(findIndex + 5);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(getLocation(mac.toLowerCase()));
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

/* Search through the identifier table and return the tiraid of the */
/*   given identifier, if found.                                    */
function getLocation(mac) {
  var tiraid = identifierTable[mac];
  if(!tiraid) {
    return "";
  }
  return JSON.stringify(tiraid, null, " ");
}

/* Listen on port 4000 */
server.listen(httpPort);
