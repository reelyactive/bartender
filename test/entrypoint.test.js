var should  = require('should');
var conf    = require('../conf').conf;
var restify = require('restify');

/**
 * Tests for the entry point
 * Check if the response correspond to our requirements
 */

// Launch a restify client, to connect to our server.
var client = restify.createJsonClient({
  version: '*',
  url: conf.host + ':' + conf.port
});

var version = '/v' + parseInt(conf.version, 10);

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
        should.not.exist(_meta.errorCode);
        _meta.moreInfo.should.be.a('string');
        _meta.totalCount.should.be.above(0);
        done();
      });
    });

    it('should set a correct _links section', function(done) {
      client.get('/', function(err, req, res, data) {
        data._links.should.be.a('object').and.have.property('self');
        data._links.should.have.property('versions');
        data._links.versions.should.be.an.instanceOf(Array);

        var firstVersion = data._links.versions[0];
        firstVersion.should.be.a('object');
        firstVersion.should.have.property('href');
        firstVersion.should.have.property('name');
        firstVersion.should.have.property('releaseDate');
        done();
      });
    });
  });

  /**
   * V0 testing
   */
  describe('/v0 should send a valid response', function() {
    it('should not set an error and return a 200', function(done) {
      client.get(version, function(err, req, res, data) {
        should.not.exist(err);
        res.should.be.json;
        res.should.have.status(200);
        done();
      });
    });

    it('should set a correct _meta section', function(done) {
      client.get(version, function(err, req, res, data) {
        var _meta = data._meta;
        _meta.message.should.equal('ok');
        _meta.statusCode.should.equal(200);
        _meta.developerMessage.should.equal('ok');
        _meta.userMessage.should.be.a('string');
        should.not.exist(_meta.errorCode);
        _meta.moreInfo.should.be.a('string');
        _meta.totalCount.should.be.above(0);
        done();
      });
    });

    it('should set a correct _links section', function(done) {
      client.get(version, function(err, req, res, data) {
        data._links.should.be.a('object').and.have.property('self');
        data._links.should.have.property('root');
        data._links.should.have.property('routes');
        var firstRoute = data._links.routes[0];
        firstRoute.should.be.a('object');
        firstRoute.should.have.property('href');
        firstRoute.should.have.property('name');
        done();
      });
    });


    it('should have correct properties', function(done) {
      client.get(version, function(err, req, res, data) {
        data.name.should.be.a('string');
        data.releaseDate.should.be.a('string');
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
  });
});