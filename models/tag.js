var commonModel     = require('./commonModel');
var databaseManager = require('./database/databasemanager');

/**
 * Tag schema
 * This is the schema representation of a tag
 * in MongoDB.
 * @type {Schema}
 */
var tagSchema = {
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
      uri: {
        reelceiver: {
          href: String
        }
      }
    },
    updateDate: Date,
    lastChangeEvent: {
      poi: {
        uuid: String,
        mac: String,
        uri: {
          reelceiver: {
            href: String
          }
        }
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
        uri: { reelceiver: { href: String }},
        rssi: Number
      }, {
        uuid: String,
        mac: String,
        uri: { reelceiver: { href: String }},
        rssi: Number
      }],
      updateDate: Date
    },
    transmitters: {}
  }
};

var tagModel = new commonModel('tag');

/**
 * Example of how to add methods to a model
 */
// tagModel.countOverrideExample = function(conditions, cb) {
//   databaseManager.db.tag.countOverrideExample(conditions, cb);
// };

module.exports.schema = tagSchema;
module.exports.model  = tagModel;