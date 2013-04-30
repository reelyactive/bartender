var Tag = require('../models/schemas/tag')();

var MgmtController = {
  dropTagCollection: function(req, res, next) {
    var tag = new Tag();
    tag.collection.drop(function(err) {
      if(err) {
        return next(err);
      } else {
        res.json(200, 'Tag collection successfully dropped');
        return next();
      }
    });
  },
  generateTags: function(req, res, next) {
    var tag = new Tag({
      uuid: 'random',
      mac: '00-10-00-57',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var tag2 = new Tag({
      uuid: 'random2',
      mac: '00-15-11-07',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var tag3 = new Tag({
      uuid: 'random3',
      mac: '00-22-22-13',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var tag4 = new Tag({
      uuid: 'random4',
      mac: '00-10-10-10',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });
    var tag5 = new Tag({
      uuid: 'random5',
      mac: '00-10-00-23',
      vendor: 'reelyActive',
      type: 'Tag',
      model: 'RA-T411-02',
      radioProtocol: 'RA-Proprietary-915MHz'
    });

    // Should use callback but this is just for
    // tests purpose.
    tag.save();
    tag2.save();
    tag3.save();
    tag4.save();
    tag5.save();

    res.json(200, 'Tags successfully added. (maybe not..)');
    return next();
  }
};

module.exports = MgmtController;