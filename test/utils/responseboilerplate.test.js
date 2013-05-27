var _                   = require('underscore');
var should              = require('should');
var responseBoilerplate = require('../../utils/responseboilerplate');
var responseMeta        = responseBoilerplate.responseMeta;

/**
 * This file tests all policies that we have defined
 */
describe('Response boilerplate validation', function() {

  describe('Response Meta testing', function() {

    // Foreach response meta  defined, test it
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