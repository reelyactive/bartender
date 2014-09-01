var barnowl = require('barnowl');
var nedb = require('nedb');
var express = require('express');

var MAX_REELCEIVERS = 6;
var MAX_STALE_MILLISECONDS = 15000;
var HTTP_PORT = 80;

var middleware = new barnowl(MAX_REELCEIVERS);
var db = new nedb();
var app = express();


/****************************************************************************/
/* barnowl listens and upserts tiraids into the database                    */
/****************************************************************************/
middleware.bind('serial', '/dev/ttyUSB0');
middleware.bind('udp', '192.168.1.117:50000');

middleware.on('visibilityEvent', function(tiraid) {
  var _id = tiraid.identifier.value;
  db.update({ _id: _id }, { $push: { transmissions: tiraid } },
            { upsert: true });
});
/****************************************************************************/


/****************************************************************************/
/* express serves requests by querying the database                         */
/****************************************************************************/
app.listen(HTTP_PORT);

app.get('/id/:id', function(req, res) {
  var id = req.param('id');
  findNearby(id, function(nearby) {
    res.json(nearby);
  });
});
/****************************************************************************/


/****************************************************************************/
/* database supports findNearby() query, periodically removes stale docs    */
/****************************************************************************/
function findNearby(id, callback) {
  db.find({ $or: [{ _id: id },
                  { "transmissions.radioDecodings.identifier.value": id }] },
          { _id: 0 }, function(err, ids) {
    var nearby = [];
    for(var cId = 0; cId < ids.length; cId++) {
      var transmissions = ids[cId].transmissions;
      var mostRecent = transmissions.length - 1;
      nearby.push(transmissions[mostRecent].identifier);
    }
    callback(nearby);
  });
}


function removeStaleDocuments() {
  var currentDate = new Date();
  var cutoffDate = currentDate.setMilliseconds(currentDate.getMilliseconds()
                                               - MAX_STALE_MILLISECONDS);
  var cutoffTime = new Date(cutoffDate).toISOString();

  db.update({}, { $pull: { transmissions: { timestamp: { $lt: cutoffTime } } } },
            { multi: true });
}

setInterval(removeStaleDocuments, MAX_STALE_MILLISECONDS);
/****************************************************************************/
