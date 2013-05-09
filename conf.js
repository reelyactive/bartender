 /**
  * Configuration file
  *
  * You can find more informations about
  * how to use this file in the README
  */

/**
 * General configuration for the restify server
 */
var ConfigurationManager = {
  /**
   * Server configuration
   * @type {Object}
   */
  CONF: {
    APP_NAME: 'Bartender',
    HOST: 'http://localhost',
    PORT: 7777,
    VERSION: '0.0.1'
  },

  /**
   * Database configuration
   * @type {Object}
   */
  DB_CONF : {
    HOST: 'localhost',
    PORT: 27017,
    DATABASE: 'bartender',
    OPTIONS: {
      server: {
        poolSize: 5,
        socketOptions: {
          keeepAlive: 1
        }
      },
      user : '',
      pass: ''
    }
  }
};

module.exports = ConfigurationManager;