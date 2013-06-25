var _                    = require('underscore');
var configurationManager = require('../conf');
var MESSAGES             = require('./messages');

/**
 * ConfigurationValidator is here to validate the configuration file
 * @type {Object}
 */
var configurationValidator = {

  conf: configurationManager.conf,
  dbConf: configurationManager.dbConf,
  err: '',
  // currentConf allow us to know if we're on Conf or DbConf
  currentConf: '',

  /**
   * Validate the configuration file and then call the callback
   * @param  {Function} next Callback
   */
  validate: function(next) {

    console.log(MESSAGES.internal.confValidation);
    configurationValidator.err = '';

    /**
     * Extend default Confs
     */

    // Default Conf settings
    var defaults = {
      appName: 'Bartender',
      host: 'localhost',
      port: 7777,
      version: '1.0.0'
    };
    configurationValidator.conf = _.extend(defaults, configurationValidator.conf);

    // Defaults DbConf settings
    defaults = {
      host: 'localhost',
      port: 27017,
      type: 'mongodb',
      database: 'reelyActiveDB',
      options: null
    };
    configurationValidator.dbConf = _.extend(defaults, configurationValidator.dbConf);

    /**
     * Validate each configuration value
     */
    // Define simple alias
    var validateValue = configurationValidator.validateValue;
    var validatePort = configurationValidator.validatePort;

    configurationValidator.currentConf = '\n- Configuration.';
    var conf = configurationValidator.conf;

    validateValue(conf.appName, 'appName');
    validateValue(conf.host, 'host');
    validatePort(conf.port);
    validateValue(conf.version, 'version');

    configurationValidator.currentConf = '\n- DbConfiguration.';
    var dbconf = configurationValidator.dbConf;

    validateValue(dbconf.host, 'host');
    validatePort(dbconf.port);
    validateValue(dbconf.type, 'type');
    validateValue(dbconf.database, 'database');
    validateValue(dbconf.options, 'options', 'object');

    var err = configurationValidator.err;

    if(err) {
      console.log(MESSAGES.internal.confInvalid);
      console.log(err);

      return next(err);
    }
    console.log(MESSAGES.internal.confValid);

    return next(null, {
      conf: configurationValidator.conf,
      dbConf: configurationValidator.dbConf
    });
  },

  /**
   * Validate a value against an expected type
   * @param  {[type]} value     value we want to validate
   * @param  {String} valueName value name
   * @param  {String} type      type the valu should equal
   */
  validateValue: function(value, valueName, type) {
    type = type || 'string';
    var currentConf = configurationValidator.currentConf;
    if(value && (typeof value !== type)) {
      configurationValidator.err += currentConf + valueName + ' should be a ' + type;
    }
  },

  /**
   * Validate a value for the type port
   * Require to be a number OR a string
   * @param  {[type]} value we want to validate
   */
  validatePort: function(value) {
    var currentConf = configurationValidator.currentConf;
    if(value && (typeof value !== 'number' && typeof value !== 'string')) {
      configurationValidator.err += currentConf + 'PORT should be a number or a string';
    }
  }
};

module.exports = configurationValidator;