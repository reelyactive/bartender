var mongoose = require('mongoose');

/**
 * Tag schema
 * This is the schema representation of a tag
 * in MongoDB.
 * @type {Schema}
 */
var tagSchema = new mongoose.Schema({
  uuid:               { type: String, default : '00000000-0000-1000-8000-000000000000' },
  mac:                { type: String, default : '00-00-00-00-00-00-00-00' },
  vendor:             { type: String, default : 'reelyActive' },
  type:               { type: String, default : 'Tag' },
  model:              { type: String, default : 'RA-T411-02' },
  radioProtocol:      { type: String, default : 'RA-Proprietary-915MHz' },
  firmware:           { type: String, default : 'firmware-name' },
  firmwareUpdateDate: { type: Date,   default : '2012-12-21T00:00:00.000Z' },
  visibility:         {
    value:            { type: String, default : 'invisible' },
    updateDate:       { type: Date,   default : '2012-12-21T00:00:00.000Z' },
    lastChangeEvent:  {
      value:          { type: String },
      updateDate:     { type: Date }
    }
  },
  location:           {
    poi:              {
      uuid:           { type: String, default : '00000000-0000-1000-8000-000000000000' },
      mac:            { type: String, default : '00-00-00-00-00-00-00-00' },
    },
    updateDate:       { type: Date,   default : '2012-12-21T00:00:00.000Z' },
    lastChangeEvent:  {
      poi:            {
        uuid:         { type: String },
        mac:          { type: String },
      },
      updateDate:     { type: Date }
    }
  },
  temperature:        {
    value:            { type: Number, default : 0 },
    updateDate:       { type: Date,   default : '2012-12-21T00:00:00.000Z' },
    lastChangeEvent:  {
      value:          { type: Number },
      updateDate:     { type: Date }
    }
  },
  batteryLevel:       {
    value:            { type: Number, default : 0 },
    updateDate:       { type: Date,   default : '2012-12-21T00:00:00.000Z' },
    lastChangeEvent:  {
      value:          { type: Number },
      updateDate:     { type: Date }
    }
  },
  radioDecodings:     {
    receivers:        {
      values : [      {
        uuid:         { type: String, default : '00000000-0000-1000-8000-000000000000' },
        mac:          { type: String, default : '00-00-00-00-00-00-00-00' },
        rssi:         { type: Number, default : 0 }
      }],
      updateDate:     { type: Date,   default : '2012-12-21T00:00:00.000Z' }
    },
    transmitters: {}
  }
});

// Compile our tagSchema into a tagModel
// A model is a class with which we construct documents.
var Tag = mongoose.model('Tag', tagSchema, 'device');

module.exports = Tag;