var validator = require('../../utils/validator');
var helper = require('../../utils/helper');

var AccountPolicy = {
    /**
     * Policy cheking for the presence of valid params in the request
     * @param  {[type]}   req  request
     * @param  {[type]}   res  response
     * @param  {Function} next callback
     */
    requireParams: function(req, res, next) {
      req.steps.push(validator.requireAccountUid);
      req.steps.push(validator.requireTagUid);
      helper.runSteps(req, res, next);
    }
};

module.exports = AccountPolicy;