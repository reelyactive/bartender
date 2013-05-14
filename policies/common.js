/**
 * Common policies are saved here
 * A policy is an action that can be attached to a route
 * and be executed before the controller is called
 * A policy can check the presence of a param, or validate one.
 * @type {[Object}
 */

var validator = require('../utils/validator');
var paginator = require('../utils/paginator');
var stepManager = require('../utils/stepManager');

var Common = {
  /**
   * Policy checking for the presence of params.id
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  requireId: function(req, res, next) {
    req.steps.push(validator.requireId);
    stepManager.runSteps(req, res, next);
  },

  /**
   * Policy checking for the presence of params.macs
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  requireMacs: function(req, res, next) {
    req.steps.push(validator.requireMacs);
    stepManager.runSteps(req, res, next);
  },

  /**
   * Policy checking for the presence of params.uuids
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  requireUuids: function(req, res, next) {
    req.steps.push(validator.requireUuids);
    stepManager.runSteps(req, res, next);
  },

  /**
   * Policy checking for validity of params.macs
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  isValidMacs: function(req, res, next) {
    req.steps.push(validator.isValidMacs);
    stepManager.runSteps(req, res, next);
  },

  /**
   * Policy checking for validity of params.uuids
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  isValidUuids: function(req, res, next) {
    req.steps.push(validator.isValidUuids);
    stepManager.runSteps(req, res, next);
  },

  /**
   * Policy formating pagination infos to the request
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  paginate: function(req, res, next) {
    req.steps.push(paginator.paginate);
    stepManager.runSteps(req, res, next);
  }
};

module.exports = Common;