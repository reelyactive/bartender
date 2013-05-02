var mongoose = require('mongoose');

/**
 * Tag model
 * This is the schema representation of a tag
 * in MongoDB.
 * @type {Schema}
 */
var TagSchema = new mongoose.Schema({
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
  lqi: {
    value: Number,
    updateDate: Date,
    lastChangeEvent: {
      value: Number,
      updateDate: Date
    }
  },
  radioDecodings: {
    transmitDataDecoded: {
      values: [{
        uuid: String,
        mac: String,
        uri: {
          reelceiver: {
            href: String
          }
        },
        rssi: Number
      }],
      updateDate: Date
    },
    receiveDataDecoded: {}
  }
});

module.exports = mongoose.model('Tag', TagSchema, 'device');