var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
  uuid: String,
  mac: String,
  vendor: String,
  type: String,
  model: String,
  radioProtocol: String,
  visibility: {
    value: Boolean,
    lastUpdateDate: Date,
    lastChangeEvent: {
      value: Boolean,
      lastUpdateDate: Date
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
    lastUpdateDate: Date,
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
      lastUpdateDate: Date
    }
  },
  temperature: {
    value: Number,
    lastUpdateDate: Date,
    lastChangeEvent: {
      value: Number,
      lastUpdateDate: Date
    }
  },
  batteryLevel: {
    value: Number,
    lastUpdateDate: Date,
    lastChangeEvent: {
      value: Number,
      lastUpdateDate: Date
    }
  },
  lqi: {
    value: Number,
    lastUpdateDate: Date,
    lastChangeEvent: {
      value: Number,
      lastUpdateDate: Date
    }
  },
  radioDecodings: {
    transmitDataDecoded: [{
      uuid: String,
      mac: String,
      uri: {
        reelceiver: {
          href: String
        }
      },
      rssi: Number
    }],
    lastUpdateDate: Date,
    lastChangeEvent: {
      poi: {
        uuid: String,
        mac: String,
        uri: {
          reelceiver: {
            href: String
          }
        },
        lastUpdateDate: Date
      }
    }
  }
});

module.exports = mongoose.model('Tag', TagSchema, 'device');