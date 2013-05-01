var CONF = require('../conf');
var restify = require('restify');

var client = restify.createJsonClient({
  version: '*',
  url: CONF.HOST + ':' + CONF.PORT
});

var VERSION = '/v' + parseInt(CONF.VERSION, 10) + '/';

describe('Status code testing', function() {

  var routes200 = ['tags', 'tags/00-10-00-57',
    'tags', 'tags/00-10-00-57',
    'tags/visible', 'tags/invisible',
    'ask', 'ask/whatat?macs=00-00-00-02', 'ask/whereis?macs=00-10-00-57',
    'ask/whatat?macs=00-00-00-02,00-00-00-01,00-00-00-06',
    'ask/whereis?macs=00-10-00-57,00-10-00-00,00-10-00-23'
  ];
  var routes404 = ['404',
    'tags/FF-FF-FF-FF-FF', 'tags/FF-FF-FF-FF-FF',
    // 'ask/whatat?macs=FF-FF-FF-FF',
    'ask/whereis?macs=FF-FF-FF-FF'
  ];

  var routes409 = ['ask/whatat', 'ask/whereis'];

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