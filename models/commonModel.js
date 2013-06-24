var databaseManager = require('./database/databasemanager');

/**
 * Contains the common requests shared by different model
 * @param  {String} modelName name of the model
 */
function commonModel(modelName) {
  this.modelName = modelName;
}

commonModel.prototype = {
  count: function(conditions, callback) {
    databaseManager.db.count(this.modelName, conditions, callback);
  },

  find: function(conditions, columns, pagination, callback) {
    databaseManager.db.find(this.modelName, conditions, columns, pagination, callback);
  }
};

module.exports = commonModel;