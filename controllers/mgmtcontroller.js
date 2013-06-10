var Tag         = require('../models/tag');
var Reelceiver  = require('../models/reelceiver');

/**
 * MgmtController
 * Management controller is only required during development
 * phase.
 * It used to drop the database and create fake data.
 * @type {Object}
 */
var mgmtController = {

  /**
   * Drop (flush) the device collection
   */
  dropDeviceCollection: function(req, res, next) {
    var device = new Tag();
    device.collection.drop(function(err) {
      if(err) {
        return next(err);
      } else {
        res.json('Device collection successfully dropped');
        return next();
      }
    });
  },

  /**
   * Generate fake devices infos in database
   */
  generateDevices: function(req, res, next) {
    var tag = new Tag({
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      mac: '00-00-00-00-00-00-00-23',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz',
      firmware: 'codename-v2',
      firmwareUpdateDate: '2013-01-09T09:09:09Z',
      visibility: {
        value: 'visible',
        updateDate: '2013-04-22T17:12:12Z',
        lastChangeEvent: {
          value: 'invisible',
          updateDate: '2013-04-22T16:00:00Z'
        }
      },
      location: {
        poi: {
          uuid: '550e8400-e29b-41d4-a716-446655440006',
          mac: '00-1b-c5-09-ff-ff-ac-d5',
        },
        updateDate: '2013-04-22T17:12:12Z',
        lastChangeEvent: {
          poi: {
            uuid: '550e8400-e29b-41d4-a716-446655440007',
            mac: '00-1b-c5-09-ff-ff-13-35',
          },
          updateDate: '2013-04-22T17:05:05Z'
        }
      },
      temperature: {
        value: 20,
        updateDate: '2013-04-22T17:12:12Z',
        lastChangeEvent: {
          value: 19,
          updateDate: '2013-04-21T11:33:33Z'
        }
      },
      batteryLevel: {
        value: 65,
        updateDate: '2013-04-22T17:12:12Z',
        lastChangeEvent: {
          value: 67,
          updateDate: '2013-04-21T11:33:33Z'
        }
      },
      radioDecodings: {
        receivers: {
          values : [{
            uuid: '550e8400-e29b-41d4-a716-446655440006',
            mac: '00-1b-c5-09-ff-ff-ac-d5',
            rssi: -42
          },{
            uuid: '550e8400-e29b-41d4-a716-446655440007',
             mac: '00-1b-c5-09-ff-ff-13-35',
             rssi: -60
          }],
          updateDate: '2013-04-22T17:12:12Z'
        },
        transmitters: undefined
      }
    });

    var tag2 = new Tag({
      uuid: '550e8400-e29b-41d4-a716-446655440002',
      mac: '00-1b-c5-09-45-c6-d7-e8',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz',
      visibility: {
        value: 'visible'
      }
    });
    var tag3 = new Tag({
      uuid: '550e8400-e29b-41d4-a716-446655440003',
      mac: '00-1b-c5-09-45-c6-d7-13',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz',
      visibility: {
        value: 'visible'
      }
    });
    var tag4 = new Tag({
      uuid: '550e8400-e29b-41d4-a716-446655440004',
      mac: '23-ff-df-c1-c6-cd-d7-55',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz',
      visibility: {
        value: 'invisible'
      }
    });
    var tag5 = new Tag({
      uuid: '550e8400-e29b-41d4-a716-446655440005',
      mac: '00-1b-c5-09-45-c6-d7-27',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });

    var reelceiver = new Reelceiver({
      uuid: '550e8400-e29b-41d4-a716-446655440006',
      mac: '00-1b-c5-09-ff-ff-ac-d5',
      vendor: 'reelyActive',
      type: 'Reelceiver',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var reelceiver2 = new Reelceiver({
      uuid: '550e8400-e29b-41d4-a716-446655440007',
      mac: '00-1b-c5-09-ff-ff-13-35',
      vendor: 'reelyActive',
      type: 'Reelceiver',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var reelceiver3 = new Reelceiver({
      uuid: '550e8400-e29b-41d4-a716-446655440008',
      mac: '00-1b-c5-09-ff-ff-19-45',
      vendor: 'reelyActive',
      type: 'Reelceiver',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var reelceiver4 = new Reelceiver({
      uuid: '550e8400-e29b-41d4-a716-446655440009',
      mac: '00-1b-c5-09-ff-ff-19-39',
      vendor: 'reelyActive',
      type: 'Reelceiver',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var reelceiver5 = new Reelceiver({
      uuid: '550e8400-e29b-41d4-a716-446655440010',
      mac: '00-1b-c5-09-ff-ff-01-23',
      vendor: 'reelyActive',
      type: 'Reelceiver',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });

    /**
     * Should use callback but this is just for
     * tests purpose.
     */
    tag.save();
    tag2.save();
    tag3.save();
    tag4.save();
    tag5.save();

    reelceiver.save();
    reelceiver2.save();
    reelceiver3.save();
    reelceiver4.save();
    reelceiver5.save();

    res.json('Devices successfully added. (maybe not..)');
    return next();
  }
};

module.exports = mgmtController;