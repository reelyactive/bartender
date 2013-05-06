/**
 * ConfigurationValidator is here to validate the configuration file
 * @type {Object}
 */
var configuration = require('../conf');

var ConfigurationValidator = {
  CONF: configuration.CONF,
  DB_CONF: configuration.DB_CONF,
  err: '',
  // currentConf allow us to know if we're on CONF or DB_CONF
  currentConf: '',

  /**
   * Validate the configuration file and then call the callback
   * @param  {Function} next Callback
   */
  validate: function(next) {

    console.log('\n## Validation of the configuration file');

    var confValidator = ConfigurationValidator;
    confValidator.err = '';

    // Define simple alias
    var vValue = confValidator.validateValue;
    var vPort = confValidator.validatePort;

    confValidator.currentConf = '\n- CONFIGURATION.';

    vValue(confValidator.CONF.APP_NAME, 'APP_NAME');
    vValue(confValidator.CONF.HOST, 'HOST');
    vPort(confValidator.CONF.PORT);
    vValue(confValidator.CONF.VERSION, 'VERSION');

    confValidator.currentConf = '\n- DB_CONFIGURATION.';

    vValue(confValidator.DB_CONF.HOST, 'HOST');
    vPort(confValidator.DB_CONF.PORT);
    vValue(confValidator.DB_CONF.DATABASE, 'DATABASE');
    vValue(confValidator.DB_CONF.OPTIONS, 'OPTIONS', 'object');

    var err = confValidator.err;

    if(err) {
      console.log('- Configuration file is not valid.');
      console.log(err);
      return next(err);
    }
    console.log('- Configuration file is valid.');
    return next();
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