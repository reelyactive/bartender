var _ = require('underscore');
var responseBoilerplate = require('../utils/responseBoilerplate');
var responseMeta = responseBoilerplate.ResponseMeta;
var responseLinks = responseBoilerplate.ResponseLinks;
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
   */
  root: function(req, res, next) {
    var result = {};
    result._meta = {};
    result._links = {};

    result._meta = new responseMeta.ok();
    result._links = responseLinks.setDefault(req);

    // Made a copy of the array (to avoid a reference)
    var versions = versionManager.versions.slice(0);
    result._links.versions = versions;

    // Find the current version and add _embedded section to it (with routes)
    _.each(result._links.versions, function findCurrentVersion(version, index) {
      // Make a copy of the object (to avoid a reference)
      version = responseLinks.generateLink('/' + version.name, req);
      version = _.extend(version, result._links.versions[index]);

      result._links.versions[index] = version;
    });

    result._meta.totalCount = result._links.versions.length;

    res.json(result);
    return next();
  },

  /**
   * Requests made on a specific version of our API
   * Return all actions currently supported by this version of the API
   * and provide links to these actions.
   */
  version: function(req, res, next) {
    var versionParam = req.params.version || versionManager.currentVersion;
    var result = {};

    // Try to find the requested version in the supported version
    _.each(versionManager.versions,
      function findCurrentVersion(version, index) {
        if(version.name === versionParam) {
          result = _.extend({}, versionManager.versions[index]);
        }
      }
    );

    // If the requested version doesn't exist return 404
    if(!result.name) {
      var message = 'The version you request, doesn\'t exist.';
      result._meta = new responseMeta.notFound(message);
    } else {
      result._meta = new responseMeta.ok();
      result._links = responseLinks.setDefault(req);
      result._links.root = responseLinks.generateLink('/', req);

      var topRoutes = routeManager.listTopRoutes(req, result.name);
      result._links.routes = topRoutes;
    }

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
                  'Now, you\'re lost.. And so am I.';
    result._meta = new responseMeta.notFound(message);
    res.send(result._meta.statusCode, result);
    return next();
  }
};

module.exports = EntryController;