var should                 = require('should');
var _                      = require('underscore');
var configurationValidator = require('../utils/configurationvalidator');
var configurationManager   = require('../conf');
var conf                   = configurationManager.conf;
var dbConf                 = configurationManager.dbConf;

/**
 * Tests for configurationValidator
 * Test his methods of validation against multiple conf files
 */
describe('Configuration validator testing', function() {

  // Resest the configuration to his default
  beforeEach(function() {
    // Object.create is used to create a copy and don't change
    // the default object
    configurationValidator.Conf = _.extend({}, conf);
    configurationValidator.DbConf = _.extend({}, dbConf);
  });

  it('should not set an error on a default configuration', function() {
    configurationValidator.validate(function confValidated(err) {
      should.not.exist(err);
    });
  });

  it('should set default values on an empty configuration', function() {
    configurationValidator.conf = null;
    configurationValidator.dbConf = null;
    configurationValidator.validate(function confValidated(err, configuration) {

      configuration.conf.appName.should.equal('Bartender');
      configuration.conf.host.should.equal('localhost');
      configuration.conf.port.should.equal(7777);
      configuration.conf.version.should.equal('1.0.0');
      configuration.dbConf.host.should.equal('localhost');
      configuration.dbConf.port.should.equal(27017);
      configuration.dbConf.database.should.equal('reelyActiveDB');
      should.not.exist(configuration.dbConf.options);
      should.not.exist(err);
    });
  });

  it('should set an error on a wrong configuration', function() {
    var wrongConf = {
      appName: 123,
      host: 123,
      port: {},
      version: 123
    };

    var wrongDbConf = {
      host: 123,
      port: {},
      database: 123,
      options: 123
    };

    configurationValidator.conf = wrongConf;
    configurationValidator.dbConf = wrongDbConf;
    configurationValidator.validate(function confValidated(err) {
      should.exist(err);
    });
  });

  testWrongConfValue('conf'   , 'appName'  , 123);
  testWrongConfValue('conf'   , 'host'     , 123);
  testWrongConfValue('conf'   , 'port'     , {});
  testWrongConfValue('conf'   , 'version'  , 123);

  testWrongConfValue('dbConf' , 'host'     , 123);
  testWrongConfValue('dbConf' , 'port'     , {});
  testWrongConfValue('dbConf' , 'database' , 123);
  testWrongConfValue('dbConf' , 'options'  , 123);

  /**
   * testWrongConfValue set a wrong value on a configuration and check
   * that the result is an error
   * @param  {String} confType   type de configuration (Conf or DbConf)
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