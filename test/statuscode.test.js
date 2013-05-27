var conf    = require('../conf').conf;
var restify = require('restify');

/**
 * Tests made for status code of each routes of our API
 * Made a request and check if the status code received is
 * the one we expected to receive.
 */

// Launch a restify client, to connect to our server.
var client = restify.createJsonClient({
  version: '*',
  url: conf.host + ':' + conf.port
});

var version = '/v' + parseInt(conf.version, 10) + '/';

describe('Status code testing', function() {

  var routes = {};

  // Routes that should return a 200 status code
  // 200 - ok
  routes[200] = [
    'tags', 'tags/00-10-00-57',
    'ask/whereis?macs=00-10-00-57',
    'ask/whereis?macs=00-10-00-57,00-10-00-00,00-10-00-23'
  ];

  // Routes that should return a 400 status code
  // 400 - Bad Request
  routes[400] = ['ask/whatat', 'ask/whereis', 'ask/howis'];

  // Routes that should return a 404 status code
  // 404 - not found
  routes[404] = [ 'notexist',
    'tags/FF-FF-FF-FF-FF'
  ];

  // Routes that should return a 501 status code
  // 501 - Not implemented
  routes[501] = [
    'ask',
    'ask/whatat?macs=00-00-00-02',
    'ask/whatat?macs=00-00-00-02,00-00-00-01,00-00-00-06',
    'ask/howis?macs=00-00-00-02'
  ];

  var routeGroupNum = -1;
  var currentRoute = -1;

  processNextRouteStatus();

  /**
   * For each routes status, check his routes
   */
  function processNextRouteStatus() {
    var keys = Object.keys(routes);
    var routesLenght = keys.length;
    if(++routeGroupNum < routesLenght) {
      var status = keys[routeGroupNum];

      describe(status + ' response check', function() {
        processNextRoute(status, routes[status]);
      });
    }
  }

  /**
   * For each routes under a status, check his response status code
   * @param  {String}  status  The current status in test
   * @param  {Array}   routes  Routes to test for the current status
   */
  function processNextRoute(status, routes) {
    if(++currentRoute < routes.length) {
      var route = routes[currentRoute];
      checkStatusCode(route, status, routes, processNextRoute);
    } else {
      currentRoute = -1;
      processNextRouteStatus();
    }
  }

  /**
   * Check the response status code for given route
   * @param  {String}   route      Url we want to test
   * @param  {String}   status     Status we excpect
   * @param  {Array}    routeGroup Routes to test (use only for callback)
   * @param  {Function} next       Callback for the next url
   */
  function checkStatusCode(route, status, routes, next) {
    it('should get a ' + status + ' response for ' + version + route, function(done) {
      client.get(version + route, function(err, req, res, data) {
        var statusNumber = parseInt(status, 10);
        if(res.statusCode !== statusNumber || data._meta.statusCode !== statusNumber) {
          var errMessage = 'Invalid response ' + res.statusCode +
                           ' from /' + route;
          errMessage += '\n Expected ' + res.statusCode + ' to equal ' + status;
          throw new Error(errMessage);
        }
        done();
      });
    });
    next(status, routes);
  }
});