var mongoose = require('mongoose');

/**
 * Manage (dis)connection with the database and load
 * the schemas
 * @type {Object}
 */
var databaseManager = {

  /**
   * Open a connection with the database using our configuration
   * Then load our schemas in mongoose to make them available in our app
   * Then continue the execution by calling the callback
   * @param  {Object}   DB_CONF  Configuration file for the database
   * @param  {Function} callback once the connection is done, call it
   */
  connectDatabase: function(dbConf, callback) {
    /**
     * Load the database configuration
     */
    var uri = 'mongodb://' +
              dbConf.host + ':' + dbConf.port + '/' + dbConf.database;

    /**
     * Connect to the database
     */
    mongoose.connect(uri, dbConf.options, function mongodbConnection(err) {
      console.log('\n## Database connection');
      /**
       * If an error occured during the connection
       * log some informations and return the error
       */
      if(err) {
        var errInfos =
          '- Cannot connect with the database.\n' +
          '    First, check that it\'s up and running.\n' +
          '    Then, check your configuration file.\n';
        errInfos = errInfos + err;
        callback(errInfos);
      }

      console.log('- Connection with the database: OK');

      /**
       * Load each models in mongoose
       */
      var ModelManager = require('../models/modelmanager');
      ModelManager.initModels();

      callback();
    });
  },

  /**
   * Disconnect the database
   */
  disconnectDatabase: function() {
    mongoose.disconnect(function mongooseDisconnected() {
      console.log('- Database disconnected');
    });
  }
};

module.exports = databaseManager;