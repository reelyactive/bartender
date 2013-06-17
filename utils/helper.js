var _ = require('underscore');

/**
 * Helper class containing usefull methods.
 * @type {Object}
 */
var helper = {

  /**
   * getNestedProperties check if an object has the nested
   * properties passed in params
   * @param  {Object} obj object we want to test
   * @return {Boolean}    either the object has these nested properties or not
   */
  getNestedProperties : function(obj, properties) {
    properties = properties.split('.') || [];

    var err;

    // For each properties, check if it's an object property
    _.each(properties, function(property) {
      if(!err) {
        if(!_.has(obj, property)) {
          err = true;
        }
        obj = obj[property];
      }
    });

    if(err) {
      return undefined;
    } else {
      return obj;
    }
  }
};

module.exports = helper;