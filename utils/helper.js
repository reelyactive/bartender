var Helper = {
  /**
   * Set steps in request object that is used for
   * stacking actions that need to be done before
   * actions.
   * @param {[type]}   req  request
   * @param {[type]}   res  response
   * @param {Function} next callback
   */
  setSteps: function(req, res, next) {
    req.steps = [];
    next();
  },

  /**
   * Run all function add to req.stack before
   * rendering an option
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  runSteps: function(req, res, next) {
    if(req.hasOwnProperty('error')) {
      return next(req.error);
    }

    var fn = req.steps.shift();
    if(fn) {
        return fn(req, res, function() {
        module.exports.runSteps(req, res, next);
      });
    }
    next();
  }
};

module.exports = Helper;