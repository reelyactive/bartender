var should = require('should');
var configurationValidator = require('../utils/configurationValidator');
var CONF = require('../conf').CONF;
var DB_CONF = require('../conf').DB_CONF;

/**
 * Tests for configurationValidator
 * Test his methods of validation against multiple CONF files
 */
describe('Configuration validator testing', function() {

  // Resest the configuration to his default
  beforeEach(function() {
    // Object.create is used to create a copy and don't change
    // the default object
    configurationValidator.CONF = Object.create(CONF);
    configurationValidator.DB_CONF = Object.create(DB_CONF);
  });

  it('should not set an error on a default configuration', function() {
    configurationValidator.validate(function confValidated(err) {
      should.not.exist(err);
    });
  });

  it('should set an error on a wrong configuration', function() {
    var WRONG_CONF = {
      APP_NAME: 123,
      HOST: 123,
      PORT: {},
      VERSION: 123
    };

    var WRONG_DB_CONF = {
      HOST: 123,
      PORT: {},
      DATABASE: 123,
      OPTIONS: 123
    };

    configurationValidator.CONF = WRONG_CONF;
    configurationValidator.DB_CONF = WRONG_DB_CONF;
    configurationValidator.validate(function confValidated(err) {
      should.exist(err);
    });
  });

  testWrongConfValue('CONF', 'APP_NAME', 123);
  testWrongConfValue('CONF', 'HOST', 123);
  testWrongConfValue('CONF', 'PORT', {});
  testWrongConfValue('CONF', 'VERSION', 123);

  testWrongConfValue('DB_CONF', 'HOST', 123);
  testWrongConfValue('DB_CONF', 'PORT', {});
  testWrongConfValue('DB_CONF', 'DATABASE', 123);
  testWrongConfValue('DB_CONF', 'OPTIONS', 123);

  /**
   * testWrongConfValue set a wrong value on a configuration and check
   * that the result is an error
   * @param  {String} confType   type de configuration (CONF or DB_CONF)
   * @param  {String} valueName  Name of the value we want to set to a wrong one
   * @param  {[type]} wrongValue Value of the wrong value
   */
  function testWrongConfValue(confType, valueName, wrongValue) {
    it('should set an error on a wrong ' + valueName, function() {
      configurationValidator[confType][valueName] = wrongValue;
      configurationValidator.validate(function confValidated(err) {
        should.exist(err);
      });
    });
  }
});