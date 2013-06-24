var fs            = require('fs');
var _             = require('underscore');
var mongoDatabase = require('./mongodatabase');

/**
 * Database is an abstract class with the purpose to make abstract requests
 * over the database, no matters which one it is.
 * @type {Object}
 */
var databaseManager = {

  init: function(conf) {
    this.models = this.findModels();
    if(conf.type === 'mongodb') {
      this.db = mongoDatabase;
      this.db.init(conf, this.models);
    }
  },

  /**
   * Find models dynamically
   * @return {Array} name of models files found at the root of the models directory
   */
  findModels: function() {
    var models = fs.readdirSync('./models');
    models     = _.without(models, 'database', 'commonModel.js');
    models     = _.map(models, function removeExtension (model) {
      return  model.replace('.js', '');
    });

    return models;
  }
};

module.exports = databaseManager;