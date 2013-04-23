var validator = require('../utils/validator');
var paginator = require('../utils/paginator');
var helper = require('../utils/helper');

var Common = {
    /**
     * Policy cheking for the presence of params.id
     * @param  {[type]}   req  request
     * @param  {[type]}   res  response
     * @param  {Function} next callback
     */
    requireId: function(req, res, next) {
      req.steps.push(validator.requireId);
      helper.runSteps(req, res, next);
    },

    /**
     * Policy cheking for the presence of params.macs
     * @param  {[type]}   req  request
     * @param  {[type]}   res  response
     * @param  {Function} next callback
     */
    requireMacs: function(req, res, next) {
      req.steps.push(validator.requireMacs);
      helper.runSteps(req, res, next);
    },

    /**
     * Policy cheking for the presence of params.uids
     * @param  {[type]}   req  request
     * @param  {[type]}   res  response
     * @param  {Function} next callback
     */
    requireUids: function(req, res, next) {
      req.steps.push(validator.requireUids);
      helper.runSteps(req, res, next);
    },

    /**
     * Policy formating pagination infos to the request
     * @param  {[type]}   req  request
     * @param  {[type]}   res  response
     * @param  {Function} next callback
     */
    paginate: function(req, res, next) {
      req.steps.push(paginator.paginate);
      helper.runSteps(req, res, next);
    }
};

module.exports = Common;