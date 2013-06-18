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
      it('should return false if the mac param is not valid', function() {
        var mac     = '00//1c5-09c6-d7-e8';
        var isValid = validator.validateMac(mac);
        isValid.should.be.false;
      });

      it('should return false if the mac param is not valid', function() {
        var mac     = '00-1b-c5-09-45-zz-d7-e8';
        var isValid = validator.validateMac(mac);
        isValid.should.be.false;
      });

      it('should return an error if a mac param is not valid', function(done) {
        req.params.macs = '00-1b-c5-09-45-c6-d7-e8,' +
                          '00-15-09c6-d7-e8,' +
                          '00-1b-c5-09-45-c6-d7-e9';
        validator.isValidMacs(req, res, function isValid() {
          should.exist(req.error);
          done();
        });
      });

      it('should return an error if the mac param is not valid', function(done) {
        req.params.macs = '00//1c5-09c6-d7-e8';
        validator.isValidMacs(req, res, function isValid() {
          should.exist(req.error);
          done();
        });
      });

      it('should return true if the mac param is valid', function() {
        var mac     = '00-1b-c5-09-45-c6-d7-e8';
        var isValid = validator.validateMac(mac);
        isValid.should.be.true;
      });

      it('should validate if all macs params are valid', function(done) {
        req.params.macs = '00-1b-c5-09-45-c6-d7-e8,' +
                          '00-15-09-c6-d7-e8-b1-c7,' +
                          '00-1b-c5-09-45-c6-d7-e9';
        validator.isValidMacs(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });

      it('should validate if the mac param is valid', function(done) {
        req.params.macs = '00-1b-c5-09-45-c6-d7-e8';
        validator.isValidMacs(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });

      it('should validate if the mac param is valid', function(done) {
        req.params.macs = '00:1b:c5:09:45:c6:d7:e8';
        validator.isValidMacs(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });
    });

    // Validate uuids parameters
    describe('Validate a uuids parameter', function() {
      it('should return false if the uuid param is not valid', function() {
        var uuid    = '550e8400-e29b-91d4-a716-446655440000';
        var isValid = validator.validateUuid(uuid);
        isValid.should.be.false;
      });

      it('should return false if the uuid param is not valid', function() {
        var uuid    = '550e8400-e29b-91d4-f716-44665ff440zz0';
        var isValid = validator.validateUuid(uuid);
        isValid.should.be.false;
      });

      it('should return an error if a uuid param is not valid', function(done) {
        req.params.uuids = '550e8400-e29b-91d4-f716-44665ff440000,'+
                           '550e8400-e29b-41d4-a716-446655440000';
        validator.isValidUuids(req, res, function isValid() {
          should.exist(req.error);
          done();
        });
      });

      it('should return an error if the uuid param is not valid', function(done) {
        req.params.uuids = '550e8400-e29b-91d4-a716-446655440000';
        validator.isValidUuids(req, res, function isValid() {
          should.exist(req.error);
          done();
        });
      });

      it('should return true if the uuid param is not valid', function() {
        var uuid    = '550e8400-e29b-41d4-a716-446655440000';
        var isValid = validator.validateUuid(uuid);
        isValid.should.be.true;
      });

      it('should validate if all uuid params are valid', function(done) {
        req.params.uuids = 'abce8400-4059-41a8-acdc-147ab5d6c1c2,' +
                           'affe8c50-e29b-3eec-ba4c-b4d5c7b8aa31,' +
                           '6730e9ac-64cb-2124-9716-446655440000';
        validator.isValidUuids(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });

      it('should validate if the uuid param is  valid', function(done) {
        req.params.uuids = '550e8400-e29b-41d4-a716-446655440000';
        validator.isValidUuids(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });
    });

    /**
     * Test the idIsAValidMacOrUuid
     * Make sure that the id param is a valid mac or uuid
     */
    describe('Make sure that id param is a valid mac or uuid', function() {
      it('should set an error if id param isn\'t valid', function(done) {
        req.params.id = 'wrongInputValue';
        validator.idIsAValidMacOrUuid(req, res, function isValid() {
          should.exist(req.error);
          done();
        });
      });

      it('should lowercase the id param', function(done) {
        req.params.id = 'AA-BB-CC-DD-AA-BB-CC-DD';
        validator.idIsAValidMacOrUuid(req, res, function isValid() {
          req.params.id.should.equal('aa-bb-cc-dd-aa-bb-cc-dd');
          should.not.exist(req.error);
          done();
        });
      });

      it('should not set an error on a valid id param (mac model)', function(done) {
        req.params.id = '00-1b-c5-09-45-c6-d7-e8';
        validator.idIsAValidMacOrUuid(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });

      it('should not set an error on a valid id param (uuid model)', function(done) {
        req.params.id = 'abce8400-4059-41a8-acdc-147ab5d6c1c2';
        validator.idIsAValidMacOrUuid(req, res, function isValid() {
          should.not.exist(req.error);
          done();
        });
      });
    });
  });