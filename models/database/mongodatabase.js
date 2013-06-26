var _            = require('underscore');
var mongoose     = require('mongoose');

/**
 * MongoDb is an object to do connection and requests to
 * MongoDb using Mongoose adapter
 * @type {Object}
 */
var mongoDatabase = {

  /**
   * Initialize the database by saving configuration and loading
   * models
   * @param  {Object} conf   database configuration
   * @param  {Array}  models models we want to load
   */
  init: function(conf, models) {
    this.conf = conf;
    this.loadModels(models);
  },

  /**
   * Load each models in mongoose
   * @param  {Array} models Array of models we want to load
   */
  loadModels: function(models) {
    _.each(models, function (modelName) {
      this.loadModel(modelName);
    }, this);
  },

  /**
   * Load a model
   * @param  {String} modelName model we want to load
   */
  loadModel: function(modelName) {
    var schema         = require('../' + modelName).schema;
    var schemaMongoose = new mongoose.Schema(schema);

    // This if allows us to extend mongoose with some of our methods
    if(this[modelName]) {
      schemaMongoose.statics = _.extend(schemaMongoose.statics, this[modelName]);
    }

    // Compile our schema into a Model
    // A model is a class with which we construct documents.
    var modelUpperCase = modelName.charAt(0).toUpperCase() + modelName.substr(1);
    var mongooseModel  = mongoose.model(modelUpperCase, schemaMongoose, 'device');

    this[modelName]  = mongooseModel;
  },

  /**
   * Connect to the database
   */
  connect: function(callback) {
    this.uri = 'mongodb://' +
                this.conf.host + ':' + this.conf.port + '/' + this.conf.database;
    mongoose.connect(this.uri, this.conf.options, callback);
  },

  /**
   * Disconnect the database
   */
  disconnect: function(callback) {
    mongoose.disconnect(callback);
  },

  /**
   * Common requests
   */

  /**
   * Count nbr of modelName (e.g. tags) depending on conditions
   * @param  {String}   modelName  name of the model (i.e. tag)
   * @param  {Object}   conditions equivalent to clause where
   * @param  {Function} callback   callback
   */
  count: function(modelName, conditions, callback) {
    this[modelName].count(conditions, callback);
  },

  /**
   * Find a collection of tags based on conditions with filter
   * on columns, and pagination informations
   * @param  {String}   modelName  name of the model (i.e. tag)
   * @param  {Object}   conditions equivalent to clause where
   * @param  {String}   columns    select specific columns
   * @param  {Object}   pagination contain the paginatio information (offset, perpage)
   * @param  {Function} callback   callback
   */
  find: function(modelName, conditions, columns, pagination, callback) {
    var query = this[modelName].find(conditions, columns);
    if(pagination) {
      query.skip(pagination.offset)
           .limit(pagination.perpage)
    }
    query.exec(callback);
  },

  /**
   * Find a collection of tags based on conditions with filter
   * on columns, and pagination informations
   * @param  {String}   modelName  name of the model (i.e. tag)
   * @param  {Object}   conditions equivalent to clause where
   * @param  {Function} callback   callback
   */
  findOne: function(modelName, conditions, callback) {
    this[modelName].findOne(conditions, callback);
  }
};

/**
 * Example of how to add specifics methods to a model (i.e. tag)
 */
// mongoDatabase.tag = {
//   countOverrideExample: function(conditions, callback) {
//     // Do your work here
//     // Here, 'this' contains the mongoose model
//     // (i.e. count is a request from mongoose)
//     this.count(conditions, callback);
//   }
// };
//
// Then, the usage on a controller would be:
//
// tagModel.countOverrideExample({type:'Tag'}, callback);

module.exports = mongoDatabase;