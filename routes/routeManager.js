var fs = require('fs');
var _ = require('underscore');

/**
 * Actions on the route
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

    // For each topRoutes, require his sub routes
    for(var i = 0, l = topRoutes.length; i < l; i++) {
      var topRoute = topRoutes[i];
      require('./' + topRoute)(server, version);
    }
  },

  /**
   * Return an array of the top routes we support
   * @param  {boolean}  format    Do we format the output for public display ?
   * @return {Array}    topRoutes supported
   */
  listTopRoutes: function(format) {
    var topRoutes = fs.readdirSync('./routes');
    topRoutes = _.without(topRoutes, 'routeManager.js');
    topRoutes = _.map(topRoutes, function removeJsExtension(file) {
      return file.replace('.js', '');
    });
    if(format) {
      return RouteManager.formatTopRoutes(topRoutes);
    }
    return topRoutes;
  },

  /**
   * Format topRoutes for public display on entry point
   * @param  {Array} topRoutes topRoutes
   * @return {Array}           list of formatted routes
   */
  formatTopRoutes: function(topRoutes) {
    // We don't want to display entry routes on entry point..
    topRoutes = _.without(topRoutes, 'entry');

    var routes = [];
    for(var i = 0, l = topRoutes.length; i < l; i++) {
      var route = topRoutes[i];
      if(route !== 'ask' && route !== 'mgmt') {
        route = route + 's';
      }
      routes.push( {
        name: route,
        href: '/' + route
      });
    }
    return routes;
  }
};

module.exports = RouteManager;