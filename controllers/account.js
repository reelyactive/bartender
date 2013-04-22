// var account = require('../models/account');


/**
 * Proceed a find request
 */
function find(req, res, next) {
  var accountUid = req.params.accountUid || 0;
  var deviceUid = req.params.deviceUid || 0;
  res.json({
    'account': accountUid,
    'device': deviceUid
  });
  return next();
}

exports.find = find;