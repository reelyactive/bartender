var should        = require('should');
var conf          = require('../conf').conf;
var restify       = require('restify');
var responsesMeta = require('./utils/responseboilerplate.test.js');

/**
 * Tests for the tags resource
 * Check if the response correspond to our requirements
 */

// Launch a restify client, to connect to our server.
var client = restify.createJsonClient({
  version: '*',
  url: conf.host + ':' + conf.port
});

var version = '/v' + parseInt(conf.version, 10);
var baseUrl = version + '/tags';

/**
 * Helper functions
 */

/**
 * validMetaTags is an helper for the meta section testing
 * @param  {String} url        url to test
 * @param  {String} visibility type of visibility (i.g. visible/invisible)
 */
var validMetaTags = function(url, visibility) {
  it('should not set an error and return a 200', function(done) {
    client.get(url, function(err, req, res, data) {
      should.not.exist(err);
      res.should.be.json;
      res.should.have.status(200);
      data._meta.should.have.property('perpage');
      data._meta.perpage.should.equal(10);
      data._meta.should.have.property('page');
      data._meta.page.should.equal(0);
      data._meta.should.have.property('visibility');
      data._meta.should.have.property('tagIdentifiers');
      data._meta.tagIdentifiers.should.be.an.instanceOf(Array);
      if(visibility) {
        if(visibility == 'visible' || visibility == 'invisible') {
          data._meta.visibility.should.equal(visibility);
        } else {
          data._meta.visibility.should.equal('all');
        }
      }
      responsesMeta.ok(data._meta);
      done();
    });
  });
};

/**
 * validLinksTags is an helper for the links section testing
 * @param  {Object} links links section of the request
 */
var validLinksTags = function(links) {
  links.should.be.a('object').and.have.property('self');
  links.should.have.property('first');
  links.should.have.property('prev');
  links.should.have.property('next');
  links.should.have.property('last');
  links.should.have.property('visible');
  links.should.have.property('invisible');
  links.should.have.property('whereAreTags');
  links.should.have.property('howAreTags');
};

/**
 * Tests implementation
 */
describe('Tags resource testing', function() {

  /**
   * /tags
   */
  describe('/tags should send a valid response', function() {

    validMetaTags(baseUrl);

    it('should set a correct _links section', function(done) {
      client.get(baseUrl, function(err, req, res, data) {
        validLinksTags(data._links);
        done();
      });
    });

    it('should have correct properties', function(done) {
      client.get(baseUrl, function(err, req, res, data) {
        var tags = data.tags;
        tags.should.be.an.instanceOf(Array);

        done();
      });
    });
  });

  /**
   * /tags.json
   */
  describe('/tags.json should send a valid response', function() {

    validMetaTags(baseUrl + '.json');

    it('should set a correct _links section', function(done) {
      client.get(baseUrl + '.json', function(err, req, res, data) {
        validLinksTags(data._links);
        var jsonInUrl = data._links.first.href.indexOf('.json');
        jsonInUrl.should.not.equal(-1);
        done();
      });
    });
  });

  /**
   * /tags?page=1&perpage=2
   */
  describe('/tags?page=1&perpage=2 should send a valid response', function() {

    it('should not set an error and return a 200', function(done) {
      client.get(baseUrl + '?page=1&perpage=2', function(err, req, res, data) {
        should.not.exist(err);
        res.should.be.json;
        res.should.have.status(200);
        data._meta.should.have.property('perpage');
        data._meta.perpage.should.equal(2);
        data._meta.should.have.property('page');
        data._meta.page.should.equal(1);
        data._meta.should.have.property('tagIdentifiers');
        data._meta.tagIdentifiers.should.be.an.instanceOf(Array);
        responsesMeta.ok(data._meta);
        done();
      });
    });

    it('should set a correct _links section', function(done) {
      client.get(baseUrl, function(err, req, res, data) {
        validLinksTags(data._links);
        done();
      });
    });

    it('should have correct properties', function(done) {
      client.get(baseUrl + '?page=1&perpage=2', function(err, req, res, data) {
        var tags = data.tags;
        tags.should.be.an.instanceOf(Array);
        tags.length.should.be.below(3);
        done();
      });
    });
  });

  /**
   * Visibility testing
   */
  describe('tags visibility testing', function() {

    /**
     * visibilityTesting is an helper for testing the visibility parameter
     * @param  {String} visibility type of visibility (i.g. visible/invisible)
     */
    var visibilityTesting = function(visibility) {
      describe('/tags?visibility=' + visibility + ' should have a valid visibility meta', function() {
        validMetaTags(baseUrl + '?visibility=' + visibility, visibility);
      });
    };

    var visibilities = ['visible', 'invisible', 'all', 'wrongValue'];

    for(var i = 0, l = visibilities.length; i < l; i++) {
      visibilityTesting(visibilities[i]);
    }
  });

  /**
   * /tags/:id testing
   */

  describe('/tags/00-00-00-00-00-00-00-23 should send a valid response', function() {

    // Test standard response + meta section
    it('should not set an error and return a 200', function(done) {
      client.get(baseUrl + '/00-00-00-00-00-00-00-23', function(err, req, res, data) {
        should.not.exist(err);
        res.should.be.json;
        res.should.have.status(200);
        data._meta.totalCount.should.equal(1);
        responsesMeta.ok(data._meta);
        done();
      });
    });

    // Test links section
    it('should set a correct _links section', function(done) {
      client.get(baseUrl + '/00-1b-c5-09-45-c6-d7-e8', function(err, req, res, data) {
        var links = data._links;
        links.should.be.a('object').and.have.property('self');
        links.should.have.property('tags');
        links.should.have.property('poi');
        links.should.have.property('howIsPoi');
        links.should.have.property('whatAtPoi');
        // links.should.have.property('prevPoi');
        // links.should.have.property('howIsPrevPoi');
        // links.should.have.property('whatAtPrevPoi');
        links.should.have.property('decodingReelceiver');
        // links.should.have.property('howAreDecodingReelceivers');
        // links.should.have.property('whatAtDecodingReelceivers');
        done();
      });
    });

    /**
     * Test all properties for a request tag on a standard response
     * @param  {Object} data data receive after a request has been made
     */
    function testPropertiesForStandardRequest(data) {
      data.should.have.property('uuid');
      data.uuid.should.be.a('string');
      data.should.have.property('mac');
      data.mac.should.be.a('string');
      data.should.have.property('vendor');
      data.vendor.should.be.a('string');
      data.should.have.property('type');
      data.type.should.be.a('string');
      data.should.have.property('model');
      data.model.should.be.a('string');
      data.should.have.property('radioProtocol');
      data.radioProtocol.should.be.a('string');
      data.should.have.property('firmware');
      data.firmware.should.be.a('string');
      data.should.have.property('firmwareUpdateDate');
      data.firmwareUpdateDate.should.be.a('string');

      data.should.have.property('radioDecodings');
      data.radioDecodings.should.be.a('object');
      data.radioDecodings.should.have.property('receivers');
      data.radioDecodings.receivers.should.have.property('updateDate');
      data.radioDecodings.receivers.updateDate.should.be.a('string');
      data.radioDecodings.receivers.should.have.property('values');
      data.radioDecodings.receivers.values.should.be.an.instanceOf(Array);

      var reelceiver = data.radioDecodings.receivers.values[0];
      if(reelceiver) {
        reelceiver.should.be.a('object');
        reelceiver.should.have.property('uuid');
        reelceiver.uuid.should.be.a('string');
        reelceiver.should.have.property('mac');
        reelceiver.mac.should.be.a('string');
        reelceiver.rssi.should.be.a('number');
        reelceiver.should.have.property('uri');
        reelceiver.uri.should.be.a('object');
        reelceiver.uri.should.have.property('reelceiver');
        reelceiver.uri.reelceiver.should.be.a('object');
        reelceiver.uri.reelceiver.should.have.property('href');
        reelceiver.uri.reelceiver.href.should.be.a('string');
      }

      // Simplify the testing of common section (like batteryLevel, temperature and visibility)
      function commonPropertiesTests(propertyName, valueType) {
        valueType = valueType || 'number';
        data[propertyName].should.be.a('object');
        data[propertyName].should.have.property('value');
        data[propertyName].value.should.be.a(valueType);
        data[propertyName].should.have.property('updateDate');
        data[propertyName].updateDate.should.be.a('string');
        // data[propertyName].should.have.property('lastChangeEvent');
        // data[propertyName].lastChangeEvent.should.be.a('object');
        // data[propertyName].lastChangeEvent.should.have.property('value');
        // data[propertyName].lastChangeEvent.value.should.be.a(valueType);
        // data[propertyName].lastChangeEvent.should.have.property('updateDate');
        // data[propertyName].lastChangeEvent.updateDate.should.be.a('string');
      }

      commonPropertiesTests('batteryLevel');
      commonPropertiesTests('temperature');
      commonPropertiesTests('visibility', 'string');

      data.location.should.be.a('object');
      data.location.should.have.property('updateDate');
      data.location.updateDate.should.be.a('string');
      data.location.should.have.property('poi');
      data.location.poi.should.be.a('object');
      data.location.poi.should.have.property('uuid');
      data.location.poi.uuid.should.be.a('string');
      data.location.poi.should.have.property('mac');
      data.location.poi.mac.should.be.a('string');
      data.location.poi.should.have.property('uri');
      data.location.poi.uri.should.be.a('object');
      data.location.poi.uri.should.have.property('reelceiver');
      data.location.poi.uri.reelceiver.should.be.a('object');
      data.location.poi.uri.reelceiver.should.have.property('href');
      data.location.poi.uri.reelceiver.href.should.be.a('string');
      // data.location.should.have.property('lastChangeEvent');
      // data.location.lastChangeEvent.should.be.a('object');
      // data.location.lastChangeEvent.should.have.property('updateDate');
      // data.location.lastChangeEvent.updateDate.should.be.a('string');
      // data.location.lastChangeEvent.should.have.property('poi');
      // data.location.lastChangeEvent.poi.should.be.a('object');
      // data.location.lastChangeEvent.poi.should.have.property('uuid');
      // data.location.lastChangeEvent.poi.uuid.should.be.a('string');
      // data.location.lastChangeEvent.poi.should.have.property('mac');
      // data.location.lastChangeEvent.poi.mac.should.be.a('string');
      // data.location.lastChangeEvent.poi.should.have.property('uri');
      // data.location.lastChangeEvent.poi.uri.should.be.a('object');
      // data.location.lastChangeEvent.poi.uri.should.have.property('reelceiver');
      // data.location.lastChangeEvent.poi.uri.reelceiver.should.be.a('object');
      // data.location.lastChangeEvent.poi.uri.reelceiver.should.have.property('href');
      // data.location.lastChangeEvent.poi.uri.reelceiver.href.should.be.a('string');
    }

    // Test response properties
    it('should have correct properties', function(done) {
      client.get(baseUrl + '/00-00-00-00-00-00-00-23', function(err, req, res, data) {
        testPropertiesForStandardRequest(data);
        done();
      });
    });

    it('should have correct properties', function(done) {
      client.get(baseUrl + '/00-1b-c5-09-45-c6-d7-e8', function(err, req, res, data) {
        testPropertiesForStandardRequest(data);
        done();
      });
    });

    // Make sure that a request w/ mac or w/ uuid has the same result
    it('should have the same result either we request with a mac or uuid param', function(done) {
      client.get(baseUrl + '/00-00-00-00-00-00-00-23', function(err, req, res, data) {
        client.get(baseUrl + '/550e8400-e29b-41d4-a716-446655440000', function(err, req, res, dataUuid) {
          // We delete this link because, obviously, it changes depending on the request
          delete data._links.self;
          delete dataUuid._links.self;
          data.should.eql(dataUuid);
          done();
        });
      });
    });

    // If the tag isn't found, it return a 404 error
    it('should set a 404 (notFound) error if the requested tag doesn\'t exist', function(done) {
      client.get(baseUrl + '/00-00-00-00-00-00-00-00', function(err, req, res, data) {
        should.exist(err);
        res.should.be.json;
        res.should.have.status(404);
        responsesMeta.notFound(data._meta);
        done();
      });
    });

    // If the id isn't valid, it returns a 400 error
    it('should set a 400 (badRequest) error if the requested tag id isn\'t valid', function(done) {
      client.get(baseUrl + '/randomBadId', function(err, req, res, data) {
        should.exist(err);
        res.should.be.json;
        res.should.have.status(400);
        responsesMeta.badRequest(data._meta);
        done();
      });
    });
  });
});