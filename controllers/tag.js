var tagModel = require('../models/tag');

var TagController = {
  /**
   * Find all tags
   */
  findTags: function(req, res, next) {
    tagModel.findTags(req, function tagsFound(err, result) {
      if(err) {
        return next(err);
      }
      res.json(200, result);

      return next();
    });
  },

  /**
   * Find a specific tag
   */
  findTag: function(req, res, next) {
    tagModel.findTag(req.params.id, function tagFound(err, tag) {
      if(err) {
        return next(err);
      }
      res.json(200, tag);

      return next();
    });
  },

  /**
   * Find visible tags
   */
  findTagsVisible: function(req, res, next) {
    TagController.findTagsByVisibility('visible', req, res, next);
  },

  /**
   * Find invisible tags
   */
  findTagsInvisible: function(req, res, next) {
    TagController.findTagsByVisibility('invisible', req, res, next);
  },

  findTagsByVisibility: function(visibility, req, res, next) {
    tagModel.findTagsByVisibility(visibility, req, function tagsFound(err, result) {
      if(err) {
        return next(err);
      }
      res.json(200, result);

      return next();
    });
  }
};

module.exports = TagController;