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
   */
  init: function(conf, models) {
    this.uri = 'mongodb://' +
                conf.host + ':' + conf.port + '/' + conf.database;
    this.conf = conf;

    /**
     * Load each models in mongoose
     */
    _.each(models, function initModel(model) {
      mongoDatabase[model].init();
    });
  },

  /**
   * Connect to the database
   */
  connect: function(callback) {
    mongoose.connect(this.uri, this.conf.options, callback);
  },

  /**
   * Disconnect the database
   */
  disconnect: function(callback) {
    mongoose.disconnect(callback);
  }
};

/**
 * Tag operations
 * @type {Object}
 */
mongoDatabase.tag = {
  /**
   * Load the tag model
   */
  init: function() {
    var tagSchema = require('../tag').schema;
    var tagSchemaMongoose = new mongoose.Schema(tagSchema);
    // Compile our tagSchema into a tagModel
    // A model is a class with which we construct documents.
    this.model = mongoose.model('Tag', tagSchemaMongoose, 'device');
  },

  /**
   * Count nbr of tags depending on conditions
   * @param  {Object}   conditions equivalent to clause where
   * @param  {Function} callback   callback
   */
  count: function(conditions, callback) {
    this.model.count(conditions, callback);
  },

  /**
   * Find a collection of tags based on conditions with filter
   * on columns, and pagination informations
   * @param  {Object}   conditions equivalent to clause where
   * @param  {String}   columns    select specific columns
   * @param  {Int}      offset     pagination offset
   * @param  {Int}      perpage    pagination perpage (=limit)
   * @param  {Function} callback   callback
   */
  find: function(conditions, columns, offset, perpage, callback) {
    this.model.find(conditions, columns)
       .skip(offset)
       .limit(perpage)
       .exec(callback);
  }
};

/**
 * Reelceiver operations
 * @type {Object}
 */
mongoDatabase.reelceiver = {
  /**
   * Load the reelceiver model
   */
  init: function() {
    var reelceiverSchema = require('../reelceiver').schema;
    var reelceiverSchemaMongoose = new mongoose.Schema(reelceiverSchema);
    // Compile our reelceiverSchema into a reelceiverModel
    // A model is a class with which we construct documents.
    this.model = mongoose.model('Reelceiver', reelceiverSchemaMongoose, 'device');
  }
};

module.exports = mongoDatabase;