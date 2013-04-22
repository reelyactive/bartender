var validator = require('../utils/validator');
var pagination = require('../utils/pagination');
var helper = require('../utils/helper');

/**
 * Policy cheking for the presence of params.id
 * @param  {[type]}   req  request
 * @param  {[type]}   res  response
 * @param  {Function} next callback
 */
function requireId(req, res, next) {
  req.steps.push(validator.requireId);
  helper.runSteps(req, res, next);
}

/**
 * Policy cheking for the presence of params.uids
 * @param  {[type]}   req  request
 * @param  {[type]}   res  response
 * @param  {Function} next callback
 */
function requireUids(req, res, next) {
  req.steps.push(validator.requireUids);
  helper.runSteps(req, res, next);
}

/**
 * Policy formating pagination infos to the request
 * @param  {[type]}   req  request
 * @param  {[type]}   res  response
 * @param  {Function} next callback
 */
function paginate(req, res, next) {
  req.steps.push(pagination.paginate);
  helper.runSteps(req, res, next);
}

exports.requireId = requireId;
exports.requireUids = requireUids;
exports.paginate = paginate;