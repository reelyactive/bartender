/**
 * EntryController
 * @type {Object}
 */
var EntryController = {
  /**
   * Requests made on the / of our API
   * Return all versions currently supported
   * by the API and provide links to these
   * versions.
   */
  root: function(req, res, next) {
    // var result = {};
    // result.supportedVersions = [
    //   {
    //     'v': 'v0',
    //     'href': 'http://localhost:7777/v0'
    //   }
    // ];
    // res.json(200, result);
    // return next();
    res.json(501, 'Entry point of the API is not implemented yet.');
    return next();
  },

  /**
   * Requests made on a specific version of our API
   * Return all actions currently supported
   * by the API and provide links to these
   * actions.
   */
  version: function(req, res, next) {
    var version = req.params.version || 1;
    res.json(501, 'Version ' + version + ' is not implemented yet.');
    return next();
  },

  /**
   * Requests made to the /404
   * I don't know why someone would like to
   * request this URL, but it's a must to have
   * a 404.
   */
  notFound: function (req, res, next) {
    var result = {};
    result._metadata = {
      statusCode: 404,
      message: 'Why did you request the 404 ? ' +
        ' Now, you\'re lost..',
      developerMessage: 'Lost ! But that\'s what ' +
        'you were looking for, right ?',
      userMessage: 'The developer wanted you ' +
        'to get lost.. Sorry.',
      errorCode: 404,
      moreInfofs: 'Lost'
    };
    res.json(404, result);
  }
};

module.exports = EntryController;