/**
 * StepManager is used by the policies.
 * His main goal his to add a "steps" array in each requests.
 * Then, we can stack actions in these steps that will be
 * executed before the controller is called.
 * The main utility is to check for parameters, validate
 * pagination infos, and so on.
 *
 * @type {Object}
 */
var StepManager = {
  /**
   * Set steps in request object that is used for
   * stacking actions that need to be done before
   * the controller is called.
   * This array is added to each requests.
   * @param {[type]}   req  request
   * @param {[type]}   res  response
   * @param {Function} next callback
   */
  setSteps: function(req, res, next) {
    req.steps = [];
    next();
  },

  /**
   * Run all functions added to req.steps before
   * calling a controller.
   * If an error is found, the execution stack is
   * stopped and the error is returned.
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  runSteps: function(req, res, next) {
    if(req.hasOwnProperty('error')) {
        var result = {};
        result._meta = req.error;
        // Return directly the error
        return res.json(result._meta.statusCode, result);
        // return next(req.error);
    }

    var fn = req.steps.shift();
    if(fn) {
      return fn(req, res, function() {
        StepManager.runSteps(req, res, next);
      });
    }
    next();
  }
};

module.exports = StepManager;