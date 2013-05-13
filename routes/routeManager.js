var fs = require('fs');
var _ = require('underscore');

/**
 * His goal is to init the routes of our API
 * He can also return a list of the available topRoutes
 * @type {Object}
 */
var RouteManager = {

  /**
   * Main router
   * His goal is to load every subroutes of our API
   * and give them to the server.
   * @param  {Object} server  Instance of restify server
   * @param  {String} version Current version of the API
   */
  initRoutes: function(server, version) {
    var topRoutes = RouteManager.listTopRoutes();

    // For each topRoutes, require the corresponding file
    for(var i = 0, l = topRoutes.length; i < l; i++) {
      var topRoute = topRoutes[i];
      require('./' + topRoute)(server, version);
    }
  },

  /**
   * Return an array of the top routes we support
   * Two output available
   *   - Array of all the top routes file
   *   - Array with an output for public display (/ and /:version) with
   *     absolute url, etc..
   * @param  {Object}  req      Do we format the output for public display ?
   * @param  {String}  version  Version to add to the absolute path
   * @return {Array}            topRoutes supported
   */
  listTopRoutes: function(req, version) {
    var topRoutes = fs.readdirSync('./routes');
    // Remove himself
    topRoutes = _.without(topRoutes, 'routeManager.js');

    // Format and create absolute links if req is set
    if(req) {
      return RouteManager.formatTopRoutes(topRoutes, req, version);
    } else {
      return topRoutes;
    }
  },

  /**
   * Format topRoutes for public display on entry point
   * @param  {Array}  topRoutes topRoutes
   * @param  {Object} req       request object to generate absolute route
   * @return {Array}            list of formatted routes
   */
  formatTopRoutes: function(topRoutes, req, version) {
    version = version || '';
    // Remove js extension
    topRoutes = _.map(topRoutes, function removeJsExtension(file) {
      return file.replace('.js', '');
    });

    // We don't want to display entry routes on entry point..
    topRoutes = _.without(topRoutes, 'entry');

    // For each route, make a beautiful display
    var routes = [];
    for(var i = 0, l = topRoutes.length; i < l; i++) {
      var routeName = topRoutes[i];

      var route = '/' + routeName;

      // Pluralize the route when it's a ressource
      if(route !== '/ask' && route !== '/mgmt') {
        route = route + 's';
        routeName = routeName + 's';
      }

      // Add the version to the absolute url
      route = '/' + version + route;

      // Generate the absolute path
      if(req) {
        var responseBoilerplate = require('../utils/responseBoilerplate');
        var responseLinks = responseBoilerplate.ResponseLinks;
        route = responseLinks.toAbsolute(route, req);
      }

      routes.push( {
        name: routeName,
        _links: {
          self: {
            href: route
          }
        }
      });
    }
    return routes;
  }
};

module.exports = RouteManager;