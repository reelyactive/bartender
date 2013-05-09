var _ = require('underscore');
var responseTemplate = require('../utils/responseTemplate');
var routeManager = require('../routes/routeManager');
var versionManager = require('../versionManager');

/**
 * EntryController
 * @type {Object}
 */
var EntryController = {

  /**
   * Requests made on the / of our API
   * Return all versions currently supported by the API
   * and provide links to these versions.
   * Also, it displays top routes under each versions
   */
  root: function(req, res, next) {
    var result = {};

    // Metadata handling
    result._meta = new responseTemplate.ok();

    // Made a copy of the array (to avoid a reference)
    result.versions = versionManager.versions.slice(0);

    result._meta.totalCount = result.versions.length;
    var topRoutes = routeManager.listTopRoutes(true);
    _.each(result.versions, function findCurrentVersion(version, index) {
      if(version.name === versionManager.currentVersion ) {
        // Make a copy of the object (to avoid a reference)
        var currentVersion = _.extend({}, result.versions[index]);
        currentVersion.routes = topRoutes;
        result.versions[index] = currentVersion;
      }
    });

    res.json(result);
    return next();
  },

  /**
   * Requests made on a specific version of our API
   * Return all actions currently supported by this version of the API
   * and provide links to these actions.
   */
  version: function(req, res, next) {
    var versionParam = req.params.version || 'v1';
    var result = {};
    result._meta = {};

    _.each(versionManager.versions, function findCurrentVersion(version, index) {
      if(version.name === versionParam) {
        result.version = versionManager.versions[index];
      }
    });

    // If the requested version doesn't exist return 404
    if(!result.version) {
      message = 'Version not supported for now';
      result._meta = new responseTemplate.notFound(message);
      res.json(result._meta.statusCode, result);
      return next();
    }

    result._meta = new responseTemplate.ok();

    var topRoutes = routeManager.listTopRoutes(true);
    result.routes = topRoutes;

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
    var result = {};
    var message = 'Why did you request the 404 ? ' +
                  'Now, you\'re lost..';
    result._meta = new responseTemplate.notFound(message);
    res.json(result._meta.statusCode, result);
  }
};

module.exports = EntryController;