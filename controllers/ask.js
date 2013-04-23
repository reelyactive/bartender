var ask = require('../models/ask');

/**
 * Find what is at a Point of Interest
 * @param  {[type]}   req  request
 * @param  {[type]}   res  response
 * @param  {Function} next callback
 */
function whatAt(req, res, next) {
  ask.whatAt(req.params, function devicesFound(err, result) {
    if(err) {
      return next(err);
    }
    res.json(200, result);

    return next();
  });
};

/**
 * Find where is a device
 * @param  {[type]}   req  request
 * @param  {[type]}   res  response
 * @param  {Function} next callback
 */
function whereIs(req, res, next) {
  var tagIds = req.params.uids;
  ask.whereIs(tagIds, function devicesFound(err, result) {
    if(err) {
      return next(err);
    }
    res.json(200, result);

    return next();
  });
};

exports.whereIs = whereIs;
exports.whatAt = whatAt;