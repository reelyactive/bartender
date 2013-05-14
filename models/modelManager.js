var fs = require('fs');
var _ = require('underscore');

/**
 * ModelsManager
 * His goal is to load every models we defined
 * @type {Object}
 */
var ModelManager = {

  /**
   * Require all our models
   */
  initModels: function() {
    var models = fs.readdirSync('./models');
    models = _.without(models, 'modelManager.js');

    // For each models, require the corresponding file
    for(var i = 0, l = models.length; i < l; i++) {
      var model = models[i];
      require('./' + model);
    }
  }
};

module.exports = ModelManager;