/**
 * ConfigurationValidator is here to validate the configuration file
 * @type {Object}
 */
var _ = require('underscore');
var configurationManager = require('../conf');

var ConfigurationValidator = {
  CONF: configurationManager.CONF,
  DB_CONF: configurationManager.DB_CONF,
  err: '',
  // currentConf allow us to know if we're on CONF or DB_CONF
  currentConf: '',

  /**
   * Validate the configuration file and then call the callback
   * @param  {Function} next Callback
   */
  validate: function(next) {

    console.log('\n## Validation of the configuration file');
    ConfigurationValidator.err = '';

    /**
     * Extend default CONFs
     */

    // Default CONF settings
    var defaults = {
      APP_NAME: 'Bartender',
      HOST: 'localhost',
      PORT: 7777,
      VERSION: '1.0.0'
    };
    ConfigurationValidator.CONF = _.extend(defaults, ConfigurationValidator.CONF);

    // Defaults DB_CONF settings
    defaults = {
      HOST: 'localhost',
      PORT: 27017,
      DATABASE: 'reelyActiveDB',
      OPTIONS: null
    };
    ConfigurationValidator.DB_CONF = _.extend(defaults, ConfigurationValidator.DB_CONF);

    /**
     * Validate each configuration value
     */
    // Define simple alias
    var validateValue = ConfigurationValidator.validateValue;
    var validatePort = ConfigurationValidator.validatePort;

    ConfigurationValidator.currentConf = '\n- CONFIGURATION.';
    var conf = ConfigurationValidator.CONF;

    validateValue(conf.APP_NAME, 'APP_NAME');
    validateValue(conf.HOST, 'HOST');
    validatePort(conf.PORT);
    validateValue(conf.VERSION, 'VERSION');

    ConfigurationValidator.currentConf = '\n- DB_CONFIGURATION.';
    var dbconf = ConfigurationValidator.DB_CONF;

    validateValue(dbconf.HOST, 'HOST');
    validatePort(dbconf.PORT);
    validateValue(dbconf.DATABASE, 'DATABASE');
    validateValue(dbconf.OPTIONS, 'OPTIONS', 'object');

    var err = ConfigurationValidator.err;

    if(err) {
      console.log('- Configuration file is not valid.');
      console.log(err);

      return next(err);
    }
    console.log('- Configuration file is valid.');

    return next(null, {
      CONF: ConfigurationValidator.CONF,
      DB_CONF: ConfigurationValidator.DB_CONF
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
    var currentConf = ConfigurationValidator.currentConf;
    if(value && (typeof value !== type)) {
      ConfigurationValidator.err += currentConf + valueName + ' should be a ' + type;
    }
  },

  /**
   * Validate a value for the type port
   * Require to be a number OR a string
   * @param  {[type]} value we want to validate
   */
  validatePort: function(value) {
    var currentConf = ConfigurationValidator.currentConf;
    if(value && (typeof value !== 'number' && typeof value !== 'string')) {
      ConfigurationValidator.err += currentConf + 'PORT should be a number or a string';
    }
  }
};

module.exports = ConfigurationValidator;