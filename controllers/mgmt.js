var Tag = require('mongoose').model('Tag');
var Reelceiver = require('mongoose').model('Reelceiver');

/**
 * MgmtController
 * Management controller is only required during development
 * phase.
 * It used to drop the database and create fake data.
 * @type {Object}
 */
var MgmtController = {
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
      uuid: 'random',
      mac: '00-10-00-57',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz',
      visibility: {
        value: 'visible'
      }
    });
    var tag2 = new Tag({
      uuid: 'random2',
      mac: '00-10-11-07',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz',
      visibility: {
        value: 'visible'
      }
    });
    var tag3 = new Tag({
      uuid: 'random3',
      mac: '00-10-22-13',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz',
      visibility: {
        value: 'visible'
      }
    });
    var tag4 = new Tag({
      uuid: 'random4',
      mac: '00-10-10-10',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz',
      visibility: {
        value: 'invisible'
      }
    });
    var tag5 = new Tag({
      uuid: 'random5',
      mac: '00-10-00-23',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });

    var reelceiver = new Reelceiver({
      uuid: 'random',
      mac: '00-80-00-57',
      vendor: 'reelyActive',
      type: 'Reelceiver',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var reelceiver2 = new Reelceiver({
      uuid: 'random2',
      mac: '00-80-11-27',
      vendor: 'reelyActive',
      type: 'Reelceiver',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var reelceiver3 = new Reelceiver({
      uuid: 'random3',
      mac: '00-80-22-45',
      vendor: 'reelyActive',
      type: 'Reelceiver',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var reelceiver4 = new Reelceiver({
      uuid: 'random4',
      mac: '00-80-77-55',
      vendor: 'reelyActive',
      type: 'Reelceiver',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var reelceiver5 = new Reelceiver({
      uuid: 'random5',
      mac: '00-80-00-23',
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

module.exports = MgmtController;