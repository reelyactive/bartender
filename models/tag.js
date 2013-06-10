var mongoose = require('mongoose');

/**
 * Tag schema
 * This is the schema representation of a tag
 * in MongoDB.
 * @type {Schema}
 */
var tagSchema = new mongoose.Schema({
  uuid: String,
  mac: String,
  vendor: String,
  type: String,
  model: String,
  radioProtocol: String,
  firmware: String,
  firmwareUpdateDate: Date,
  visibility: {
    value: String,
    updateDate: Date,
    lastChangeEvent: {
      value: String,
      updateDate: Date
    }
  },
  location: {
    poi: {
      uuid: String,
      mac: String,
    },
    updateDate: Date,
    lastChangeEvent: {
      poi: {
        uuid: String,
        mac: String,
      },
      updateDate: Date
    }
  },
  temperature: {
    value: Number,
    updateDate: Date,
    lastChangeEvent: {
      value: Number,
      updateDate: Date
    }
  },
  batteryLevel: {
    value: Number,
    updateDate: Date,
    lastChangeEvent: {
      value: Number,
      updateDate: Date
    }
  },
  radioDecodings: {
    receivers: {
      values : [{
        uuid: String,
        mac: String,
        rssi: Number
      }, {
        uuid: String,
        mac: String,
        rssi: Number
      }],
      updateDate: Date
    },
    transmitters: {}
  }
});

// Compile our tagSchema into a tagModel
// A model is a class with which we construct documents.
var Tag = mongoose.model('Tag', tagSchema, 'device');

module.exports = Tag;