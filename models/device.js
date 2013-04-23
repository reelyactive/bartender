var restify = require('restify');

var DeviceModel = {
  /**
   * Fake DB for devices
   */
  devices: [
    {
      id: '00-10-00-57',
      location: 'Rouen',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    },
    {
      id: '00-16-00-31',
      location: 'Montréal',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    },
    {
      id: '00-ff-ff-54',
      location: 'Paris',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    },
    {
      id: '11-13-45-ed',
      location: 'Toronto',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    },
    {
      id: '02-78-99-f1',
      location: 'San Francisco',
      sensors: [{
        type: 'battery',
        value: '83'
      }]
    }
  ],

  /**
   * Find a device
   */
  findDevice: function(id, cb) {
    for(var i =0, l = this.devices.length; i < l; i++) {
      if(this.devices[i].id === id) {
        return cb(null, this.devices[i]);
      }
    }
    return cb(new restify.ResourceNotFoundError('No device  with id ' + id + ' found'));
  },

  /**
   * Find all devices
   */
  findDevices: function(params, cb) {
    var offset = params.offset;
    var limit = params.limit;
    var result = this.devices.slice(offset, limit);

    if(result.length === 0) {
      return cb(new restify.ResourceNotFoundError('No devices found'));
    }
    var total = this.devices.length;
    var paginationResult = {
      pagination: {
          offset: offset,
          limit: limit,
          total: total
      },
      result: result
    }
    return cb(null, paginationResult);
  },

  /**
   * Proceed a find request
   */
  findDeviceRequest: function(id, cb) {
    this.findDevice(id, function deviceFound(err, device) {
      if(err) {
        return cb(err);
      }
      return cb(null, device);
    });
  },

  /**
   * Locate a device
   */
  location: function(id, cb) {
    this.findDevice(id, function deviceFound(err, device) {
      if(err) {
        return cb(err);
      }
      return cb(null, device);
    });
  }
};

module.exports = DeviceModel;