var responseTemplate = require('../utils/responseTemplate');
var apiResponse = require('../utils/apiResponse');


/**
 * EntryController
 * @type {Object}
 */
var EntryController = {

  /**
   * Requests made on the / of our API
   * Return all versions currently supported
   * by the API and provide links to these
   * versions.
   */
  root: function(req, res, next) {
    var result = {};

    // Metadata handling
    result._meta = apiResponse.ok();
    result.versions = [
      {
        'name': 'v0',
        'href': '/v0'
      }
    ];
    res.json(200, result);
    return next();
  },

  /**
   * Requests made on a specific version of our API
   * Return all actions currently supported
   * by the API and provide links to these
   * actions.
   */
  version: function(req, res, next) {
    var version = req.params.version || 1;
    var result = {};
    var message = 'Version ' + version + ' is not implemented yet.';
    result._meta = new responseTemplate.notImplemented(message);
    res.json(result._meta.statusCode, result);
    return next();
  },

  /**
   * Requests made to the /404
   * I don't know why someone would like to
   * request this URL, but it's a must to have
   * a 404.
   */
  notFound: function (req, res, next) {
    var message = 'Why did you request the 404 ? ' +
        ' Now, you\'re lost..';
    var result = {};
    result._meta = new responseTemplate.notFound(message);
    res.json(result._meta.statusCode, result);
  }
};

module.exports = EntryController;