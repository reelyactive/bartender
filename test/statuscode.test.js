var CONF = require('../conf').CONF;
var restify = require('restify');

/**
 * Tests made for status code of each routes of our API
 * Made a request and check if the status code received is
 * the one we expected to receive.
 */

// Launch a restify client, to connect to our server.
var client = restify.createJsonClient({
  version: '*',
  url: CONF.HOST + ':' + CONF.PORT
});

var VERSION = '/v' + parseInt(CONF.VERSION, 10) + '/';

describe('Status code testing', function() {

  // Routes that should return a 200 status code
  // 200 - ok
  var routes200 = ['tags', 'tags/00-10-00-57',
    'tags', 'tags/00-10-00-57',
    'tags/visible', 'tags/invisible',
    'ask/whereis?macs=00-10-00-57',
    'ask/whereis?macs=00-10-00-57,00-10-00-00,00-10-00-23'
  ];

  // Routes that should return a 404 status code
  // 404 - not found
  var routes404 = ['404',
    'tags/FF-FF-FF-FF-FF', 'tags/FF-FF-FF-FF-FF'
  ];

  // Routes that should return a 409 status code
  // 409 - Missing parameter
  var routes409 = ['ask/whatat', 'ask/whereis'];

  // Routes that should return a 501 status code
  // 501 - Not implemented
  var routes501 = [
    'ask',
    'ask/whatat?macs=00-00-00-02',
    'ask/whatat?macs=00-00-00-02,00-00-00-01,00-00-00-06',
  ];

  var routes = [
    {
      'status': 200,
      'routes': routes200
    },
    {
      'status': 404,
      'routes': routes404
    },
    {
      'status': 409,
      'routes': routes409
    },
    {
      'status': 501,
      'routes': routes501
    }
  ];

  var routeGroupNum = -1;
  var routeNum = -1;

  processNextRouteGroup();

  /**
   * For each road groups check his routes
   */
  function processNextRouteGroup() {
    if(++routeGroupNum < routes.length) {
      var routeGroup = routes[routeGroupNum];
      describe(routeGroup.status + ' response check', function() {
        processNextRoute(routeGroup);
      });
    }
  }

  /**
   * For each routes in a group, check his response status code
   * @param  {Object}  routeGroup JSON Object representing a status code
   *                              and an array of routes to test
   */
  function processNextRoute(routeGroup) {
    if(++routeNum < routeGroup.routes.length) {
      var route = routeGroup.routes[routeNum];
      checkStatusCode(route, routeGroup, processNextRoute);
    } else {
      routeNum = -1;
      processNextRouteGroup();
    }
  }

  /**
   * Check the response status code for given road
   * @param  {String}   route      Url we want to test
   * @param  {Object}   routeGroup JSON Object representing a status code
   *                              and an array of routes to test
   * @param  {Function} next       Callback for the next url
   */
  function checkStatusCode(route, routeGroup, next) {
    var status = routeGroup.status;
    it('should get a ' + status + ' response for ' + VERSION + route, function(done) {
      client.get(VERSION + route, function(err, req, res, data) {
        if(res.statusCode !== status) {
          var errMessage = 'Invalid response ' + res.statusCode +
                           ' from /' + route;
          errMessage += '\n Expected ' + res.statusCode + ' to equal ' + status;
          throw new Error(errMessage);
        }
        done();
      });
    });
    next(routeGroup);
  }
});