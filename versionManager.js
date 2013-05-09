 /**
  * Versions Manager
  */

var VersionManager = {
  currentVersion: 'v0',

  /**
   * List of supported version
   * @type {Array}
   */
  versions: [
    {
      'name': 'v0',
      'href': '/v0',
      'releaseDate': '2013-05-09T00:00:01Z'
    },
    {
      'name': 'v1',
      'href': '/v1',
      'releaseDate': '77777777'
    }

  ]
};

module.exports = VersionManager;