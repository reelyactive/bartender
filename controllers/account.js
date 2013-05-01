// var accountModel = require('../models/account');
var tagModel = require('../models/tag');

var AccountController = {
  /**
   * Proceed a find request
   */
  findTag: function(req, res, next) {
    var accountUid = req.params.accountUid || 0;
    var tagUid = req.params.tagUid || 0;

    tagModel.findTagRequest(tagUid, function tagFound(err, tag) {
      if(err) {
        return next(err);
      }
      res.json(200, {
        'account': accountUid,
        'tag': tag
      });
      return next();
    });
  }
};

module.exports = AccountController;