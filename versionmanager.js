 /**
  * Versions Manager
  * A static object containing the current version and a list
  * of supported versions.
  */

var versionManager = {
  currentVersion: 'v0',

  /**
   * List of supported versions
   * @type {Array}
   */
  versions: [
    {
      'name': 'v0',
      'releaseDate': '2013-05-09T00:00:01Z',
    }
  ]
};

module.exports = versionManager;