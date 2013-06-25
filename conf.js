 /**
  * Configuration file
  *
  * You can find more informations about
  * how to use this file in the README
  */

/**
 * General configuration for the restify server
 */
var configurationManager = {
  /**
   * Server configuration
   * @type {Object}
   */
  conf: {
    appName: 'Bartender',
    host: 'http://localhost',
    port: 7777,
    version: '0.0.1'
  },

  /**
   * Database configuration
   * @type {Object}
   */
  dbConf : {
    host: 'localhost',
    port: 27017,
    type: 'mongodb',
    database: 'bartender',
    options: {
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

module.exports = configurationManager;