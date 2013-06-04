var _                   = require('underscore');
var should              = require('should');
var responseBoilerplate = require('../../utils/responseboilerplate');
var responseMeta        = responseBoilerplate.responseMeta;

/**
 * Test all responses meta that we have defined
 */
describe('Response boilerplate validation', function() {

  describe('Response Meta testing', function() {

    // Foreach meta responses defined, test it
    _.each(responseMeta, function testMetaSection(value, key) {

      if(responseMeta.hasOwnProperty(key)) {

        var meta = new responseMeta[key];
        it('should have a correct meta structure for error '
            + meta.statusCode, function() {

          meta.should.be.a('object');
          meta.message.should.be.a('string');
          meta.statusCode.should.be.a('number');
          meta.developerMessage.should.be.a('string');
          meta.userMessage.should.be.a('string');
          if(meta.statusCode !== 200) {
            meta.errorCode.should.be.a('number');
          } else {
            should.not.exist(meta.errorCode);
          }
          meta.moreInfo.should.be.a('string');
        });
      }
    });
  });
});

/**
 * Each tests for meta responses are exported in a function of the
 * responsesMeta object
 * This allow us to use these functions in other tests
 * For example, if we want to test that a GET request on the entry point
 * return a meta response of type Ok (200)
 *
 * @type {Object}
 */
var responsesMeta = {};

// Foreach response meta add a test function to responsesMeta
_.each(responseMeta, function testMetaSection(value, key) {

  if(responseMeta.hasOwnProperty(key)) {

    // Valid meta that we compare against the one received
    var validMeta = new responseMeta[key];
    // Deletes the message and the total count because
    // it can change depending on the request and fail
    // our test
    delete validMeta.message;
    delete validMeta.totalCount;

    // Lower camel case the key
    key = key.charAt(0).toLowerCase() + key.slice(1);
    responsesMeta[key] = function(meta) {
      // Delete these values beacause it's not part of
      // a base request (specific testing cases)
      delete meta.message;
      delete meta.totalCount;
      delete meta.perpage;
      delete meta.page;
      delete meta.visibility;
      meta.should.eql(validMeta);
    };
  }
});

module.exports = responsesMeta;