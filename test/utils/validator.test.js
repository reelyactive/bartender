var should    = require('should');
var validator = require('../../utils/validator');

/**
 * Tests for the validator functions
 */
describe('Validator testing', function() {
    var req, res;
    beforeEach(function() {
      req = {};
      req.params = {};
      req.error = null;
      res = {};
    });

    /**
     * Test the requireParam function from the validator
     * @param  {String} paramName  Name of the param you want to test
     * @param  {String} paramValue Value of this param
     */
    function requireParam(paramName, paramValue) {
      var CamelCaseParam = paramName.charAt(0).toUpperCase() + paramName.substr(1);
      it('should set an error if an "' + paramName + '" isn\'t present in the req.params', function() {
        validator['require' + CamelCaseParam](req, res, function() {
          should.not.exist(req.params[paramName]);
          should.exist(req.error);
        });
      });

      it('should check if an "' + paramName + '" is present in the req.params', function() {
        req.params[paramName] = paramValue;
        validator['require' + CamelCaseParam](req, res, function() {
          should.exist(req.params[paramName]);
          should.not.exist(req.error);
        });
      });
    }

    // Require param tests
    describe('Require id', function() {
      requireParam('id', '00-10-00-57');
    });

    describe('Require macs', function() {
      requireParam('macs', 'aabbcc,ddeeff');
    });

    describe('Require uuids', function() {
      requireParam('uuids', '00-10-00-57,00-10-00-69');
    });

    describe('Require tagUuid', function() {
      requireParam('tagUuid', '00-10-00-57');
    });

    /**
     * Tests for parameters validation
     */

    // Validate macs parameters
    describe('Validate a macs parameter', function() {
      it('should return an error if the param is not valid', function(done) {
        req.params.macs = '00-1b-c5-09-45-c6-d7-e8,' +
                          '00-15-09c6-d7-e8,' +
                          '00-1b-c5-09-45-c6-d7-e8';
        validator.isValidMacs(req, res, function isValid() {
          should.exist(req.error);
          done();
        });
      });

      it('should return an error if the param is not valid', function(done) {
        req.params.macs = '00//1c5-09c6-d7-e8';
        validator.isValidMacs(req, res, function isValid() {
          should.exist(req.error);
          done();
        });
      });

      it('should validate if the param is  valid', function(done) {
        req.params.macs = '00-1b-c5-09-45-c6-d7-e8';
        validator.isValidMacs(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });

      it('should validate if the param is  valid', function(done) {
        req.params.macs = '00:1b:c5:09:45:c6:d7:e8';
        validator.isValidMacs(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });
    });

    // Validate uuids parameters
    describe('Validate a uuids parameter', function() {
      it('should return an error if the param is not valid', function(done) {
        req.params.uuids = '550e8400-e29b-91d4-f716-44665ff440000,'+
                            '550e8400-e29b-41d4-a716-446655440000';
        validator.isValidUuids(req, res, function isValid() {
          should.exist(req.error);
          done();
        });
      });

      it('should return an error if the param is not valid', function(done) {
        req.params.uuids = '550e8400-e29b-91d4-a716-446655440000';
        validator.isValidUuids(req, res, function isValid() {
          should.exist(req.error);
          done();
        });
      });

      it('should validate if the param is  valid', function(done) {
        req.params.uuids = '550e8400-e29b-41d4-a716-446655440000';
        validator.isValidUuids(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });
    });
  });