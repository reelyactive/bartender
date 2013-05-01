var askModel = require('../models/ask');

var AskController = {
  /**
   * Specify which actions are available for this ressource
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  root: function(req, res, next) {
    var result = {};
    result.description = 'Allow you to ask the API';
    result.supportedActions = [
      {
        'href': 'whatAt',
        'versionsSupported': ['v0']
      },
      {
        'href': 'whereIs',
        'versionsSupported': ['v0']
      }
    ];
    res.json(200, result);
    return next();
  },

  /**
   * Find what is at a Point of Interest
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  whatAt: function(req, res, next) {
    askModel.whatAt(req, function devicesFound(err, result) {
      if(err) {
        return next(err);
      }
      res.json(200, result);

      return next();
    });
  },

  /**
   * Find where is a(many) tag(s)
   * @param  {[type]}   req  request
   * @param  {[type]}   res  response
   * @param  {Function} next callback
   */
  whereIs: function(req, res, next) {
    askModel.whereIs(req, function tagsFound(err, result) {
      if(err) {
        return next(err);
      }
      res.json(200, result);

      return next();
    });
  }
};

module.exports = AskController;