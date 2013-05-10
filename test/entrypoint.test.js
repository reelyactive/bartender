var should = require('should');
var CONF = require('../conf').CONF;
var restify = require('restify');

/**
 * Tests for the entry point
 * Check if the response correspond to our requirements
 */

// Launch a restify client, to connect to our server.
var client = restify.createJsonClient({
  version: '*',
  url: CONF.HOST + ':' + CONF.PORT
});

var VERSION = '/v' + parseInt(CONF.VERSION, 10);

describe('Entry point testing', function() {

  /**
   * Root testing
   */
  describe('Root should send a valid response', function() {

    it('should not set an error and return a 200', function(done) {
      client.get('/', function(err, req, res, data) {
        should.not.exist(err);
        res.should.be.json;
        res.should.have.status(200);
        done();
      });
    });

    it('should set a correct _meta section', function(done) {
      client.get('/', function(err, req, res, data) {
        var _meta = data._meta;
        _meta.message.should.equal('ok');
        _meta.statusCode.should.equal(200);
        _meta.developerMessage.should.equal('ok');
        _meta.userMessage.should.be.a('string');
        should.not.exist(_meta.errorCode)
        _meta.moreInfo.should.be.a('string');
        _meta.totalCount.should.be.above(0);
        done();
      });
    });

    it('should set a correct _links section', function(done) {
      client.get('/', function(err, req, res, data) {
        data._links.should.be.a('object').and.have.property('self');
        done();
      });
    });


    it('should have correct properties', function(done) {
      client.get('/', function(err, req, res, data) {
        data.versions.should.be.an.instanceOf(Array);

        var firstVersion = data.versions[0];
        firstVersion.should.be.a('object');
        firstVersion.should.have.property('name');
        firstVersion.should.have.property('releaseDate')
        firstVersion.should.have.property('_links')
        firstVersion.should.have.property('_embedded');
        done();
      });
    });
  });

  /**
   * V0 testing
   */
  describe('/v0 should send a valid response', function() {
    it('should not set an error and return a 200', function(done) {
      client.get(VERSION, function(err, req, res, data) {
        should.not.exist(err);
        res.should.be.json;
        res.should.have.status(200);
        done();
      });
    });

    it('should set a correct _meta section', function(done) {
      client.get(VERSION, function(err, req, res, data) {
        var _meta = data._meta;
        _meta.message.should.equal('ok');
        _meta.statusCode.should.equal(200);
        _meta.developerMessage.should.equal('ok');
        _meta.userMessage.should.be.a('string');
        should.not.exist(_meta.errorCode)
        _meta.moreInfo.should.be.a('string');
        _meta.totalCount.should.be.above(0);
        done();
      });
    });

    it('should set a correct _links section', function(done) {
      client.get(VERSION, function(err, req, res, data) {
        data._links.should.be.a('object').and.have.property('self');
        data._links.should.have.property('root');
        done();
      });
    });


    it('should have correct properties', function(done) {
      client.get(VERSION, function(err, req, res, data) {
        data.name.should.be.a('string');
        data.releaseDate.should.be.a('string');
        done();
      });
    });

    it('should have correct _embedded section', function(done) {
      client.get(VERSION, function(err, req, res, data) {
        data._embedded.should.be.a('object').and.have.property('routes');
        done();
      });
    });
  });

  /**
   * V999 testing
   * 999 is a random number for a unexisting version, ever.
   */
  describe('/v999 should send a 404 response', function() {
    it('should set an error and return a 404', function(done) {
      client.get('/v999', function(err, req, res, data) {
        should.exist(err);
        res.should.be.json;
        res.should.have.status(404);
        done();
      });
    });

    it('should set a correct _meta section', function(done) {
      client.get('/v999', function(err, req, res, data) {
        var _meta = data._meta;
        _meta.message.should.be.a('string');
        _meta.statusCode.should.equal(404);
        _meta.developerMessage.should.equal('notFound');
        _meta.userMessage.should.be.a('string');
        _meta.errorCode.should.equal(404);
        _meta.moreInfo.should.be.a('string');
        done();
      });
    });

    it('should set a correct _links section', function(done) {
      client.get('/v999', function(err, req, res, data) {
        data._links.should.be.a('object').and.have.property('self');
        done();
      });
    });
  });

  /**
   * 404 testing
   */
  describe('/404 should send a 404 response', function() {
    it('should set an error and return a 404', function(done) {
      client.get('/404', function(err, req, res, data) {
        should.exist(err);
        res.should.be.json;
        res.should.have.status(404);
        done();
      });
    });

    it('should set a correct _meta section', function(done) {
      client.get('/404', function(err, req, res, data) {
        var _meta = data._meta;
        _meta.message.should.be.a('string');
        _meta.statusCode.should.equal(404);
        _meta.developerMessage.should.equal('notFound');
        _meta.userMessage.should.be.a('string');
        _meta.errorCode.should.equal(404);
        _meta.moreInfo.should.be.a('string');
        done();
      });
    });

    it('should set a correct _links section', function(done) {
      client.get('/404', function(err, req, res, data) {
        data._links.should.be.a('object').and.have.property('self');
        done();
      });
    });
  });
});