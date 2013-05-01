var mongoose = require('mongoose');

var ReelceiverSchema = new mongoose.Schema({
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
  temperature: {
    value: Number,
    updateDate: Date,
    lastChangeEvent: {
      value: Number,
      updateDate: Date
    }
  },
  undervoltage: {
    value: Boolean,
    updateDate: Date
  },
  lqi: {
    value: Number,
    updateDate: Date,
    lastChangeEvent: {
      value: Number,
      updateDate: Date
    }
  },
  led: {
   value: String
  },
  radioDecodings: {
    transmitDataDecoded: {},
    receivedDataDecoded: {
      values: [{
        uuid: String,
        mac: String,
        uri: {
          tag: {
            href: String
          }
        },
        rssi: Number
      }],
      updateDate: Date
    }
  }
});

module.exports = mongoose.model('Reelceiver', ReelceiverSchema, 'device');