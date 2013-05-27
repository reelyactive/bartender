var should  = require('should');
var conf    = require('../../conf').conf;
var restify = require('restify');

/**
 * Tests made for status code of each routes of our API
 * Made a request and check if the status code received is
 * the one we expected to receive.
 */

// Launch a restify client, to connect to our server.
var client = restify.createJsonClient({
  version: '*',
  url: conf.host + ':' + conf.port
});

describe('Not acceptable error (406) testing', function() {

  var options = {
    path: '/',
    headers: {
      'accept': 'application/json'
    }
  };

  it('should not return an not acceptable error', function(next) {
    client.get(options, function(err, req, res) {
      should.not.exist(err);
      next();
    });
  });

  it('should return an notAcceptable error on bad Accept header', function(next) {
    options.headers = {
      'accept': 'application/xml'
    };

    client.get(options, function(err, req, res) {
      should.exist(err);
      err.body._meta.statusCode.should.equal(406);
      next();
    });
  });


  it('should take priority on the format specified in url rather than the header accept', function(next) {
    options = {
      path: '/.json',
      headers: {
        'accept': 'application/xml'
      }
    };

    client.get(options, function(err, req, res) {
      should.not.exist(err);
      next();
    });
  });
});