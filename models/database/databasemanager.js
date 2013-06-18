var mongoDatabase = require('./mongodatabase');

/**
 * Database is an abstract class with the purpose to make abstract requests
 * over the database, no matters which one it is.
 * @type {Object}
 */
var databaseManager = {

  init: function(conf) {
    this.models = ['tag', 'reelceiver'];

    if(conf.type === 'mongodb') {
      this.db = mongoDatabase;
      this.db.init(conf, this.models);
    }
  }
};

module.exports = databaseManager;