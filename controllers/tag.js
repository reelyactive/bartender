var tagModel = require('../models/tag');

var TagController = {
  /**
   * Find all tags
   */
  findTags: function(req, res, next) {
    tagModel.findTags(req.params, function tagsFound(err, result) {
      if(err) {
        return next(err);
      }

      res.json(200, result);
      return next();
    });
  },

  /**
   * Proceed a find request
   */
  findTagRequest: function(req, res, next) {
    tagModel.findTagRequest(req.params.id, function tagFound(err, tag) {
      if(err) {
        return next(err);
      }
      res.json(200, { code: 200, message: 'Tag # ' + tag.id + ' found !' });
      return next();
    });
  }
};

module.exports = TagController;