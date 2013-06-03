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
      data._meta.should.have.property('limit');
      data._meta.limit.should.equal(10);
      data._meta.should.have.property('offset');
      data._meta.offset.should.equal(0);
      data._meta.should.have.property('visibility');
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
   * /tags?offset=1&limit=2
   */
  describe('/tags?offset=1&limit=2 should send a valid response', function() {

    it('should not set an error and return a 200', function(done) {
      client.get(baseUrl + '?offset=1&limit=2', function(err, req, res, data) {
        should.not.exist(err);
        res.should.be.json;
        res.should.have.status(200);
        data._meta.should.have.property('limit');
        data._meta.limit.should.equal(2);
        data._meta.should.have.property('offset');
        data._meta.offset.should.equal(1);
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
      client.get(baseUrl + '?offset=1&limit=2', function(err, req, res, data) {
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
});