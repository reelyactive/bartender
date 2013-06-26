var restify      = require('restify');
var _            = require('underscore');
var stepManager  = require('./stepmanager');
var helper       = require('./helper');
var responseMeta = require('./responseboilerplate').responseMeta;
var MESSAGES     = require('./messages');

/**
 * Usefull methods for the server to work.
 */
var serverManager = {
  /**
   * Configure the server with some default options
   * @param  {Object}   server the server himself
   */
  configure: function(server, Conf) {
    server.acceptable = ['application/json'];
    server.pre(restify.pre.sanitizePath());
    server.use(helper.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    server.use(stepManager.setSteps);

    serverManager._setAcceptHeader(server);
    serverManager._handleDefaultEvents(server, Conf);
  },

  /**
   * Set Accept header based on the presence of a ".:format"
   * example : ***.json set Accept header to application/json
   * @param  {Object}   server the server himself
   */
  _setAcceptHeader: function(server) {
    server.pre(function setAcceptHeader(req, res, next) {
      var acceptJson = /(\.json\?)|(\.json$)/;
      req.url = server.url + req.url;

      if(acceptJson.test(req.url)) {
        // Force accept header to JSON
        req.headers.accept = 'application/json';
        // Clean the url
        req.url = req.url.replace(/\.json/, '');
        // Keep the info that .json was in the url
        req.urlFormatRequest = '.json';
      }

      return next();
    });
  },

  /**
   * Let's the server handle some default events like NotFound
   * Override default error handlers, so we can return our
   * common responseMeta
   * @param  {Object}   server  the server himself
   * @param  {Object}   Conf    the server configuration
   */
  _handleDefaultEvents: function(server, conf) {
    // On error (example : Address in use)
    server.on('error', function serverError(err) {
      if(err && err.code === 'EADDRINUSE') {
        console.log(_.template(MESSAGES.errors.portAlreadyUse, {port: conf.port}));
      }
      console.log(err);
      process.exit();
    });

    // 404 - Not found
    server.on('NotFound', function notFound(req, res, next) {
      var result = {};
      result._meta = new responseMeta.NotFound();
      res.json(result._meta.statusCode, result);
      return next();
    });

    // 500 - Internal error
    server.on('uncaughtException', function after(req, res, route, err) {
      var result = {};
      console.log(_.template(MESSAGES.errors.uncaughtException, {err: err.message}));
      result._meta = new responseMeta.InternalServerError();
      res.json(result._meta.statusCode, result);
    });
  }
};

module.exports = serverManager;