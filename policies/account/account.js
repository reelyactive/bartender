var validator = require('../../utils/validator');
var helper = require('../../utils/helper');

/**
 * Policy cheking for the presence of valid params in the request
 * @param  {[type]}   req  request
 * @param  {[type]}   res  response
 * @param  {Function} next callback
 */
function requireParams(req, res, next) {
  req.steps.push(validator.requireAccountUid);
  req.steps.push(validator.requireDeviceUid);
  helper.runSteps(req, res, next);
}

exports.requireParams = requireParams;