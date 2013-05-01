var should = require('should');
var validator = require('../utils/validator');
var paginator = require('../utils/paginator');


describe('Policies validation', function() {

  describe('Validator testing', function() {
    var req, res;
    beforeEach(function() {
      req = {};
      req.params = {};
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

    // Tests
    describe('Require id', function() {
      requireParam('id', '00-10-00-57');
    });

    describe('Require macs', function() {
      requireParam('macs', 'aabbcc,ddeeff');
    });

    describe('Require uids', function() {
      requireParam('uids', '00-10-00-57,00-10-00-69');
    });

    describe('Require tagUid', function() {
      requireParam('tagUid', '00-10-00-57');
    });
  });

  describe('Paginator', function() {
    var req, res;
    beforeEach(function() {
      req = {};
      req.params = {};
      res = {};
    });

    it('should set a defaults paginaton params in the req', function() {
      paginator.paginate(req, res, function() {
        should.exist(req.params.offset);
        should.exist(req.params.limit);
        req.params.offset.should.equal(0);
        req.params.limit.should.equal(10);
      });
    });

    it('should set paginaton params based on the params', function() {
      req.params.offset = 3;
      req.params.limit = 23;
      paginator.paginate(req, res, function() {
        should.exist(req.params.offset);
        should.exist(req.params.limit);
        req.params.offset.should.equal(3);
        req.params.limit.should.equal(23);
      });
    });

    it('should set paginaton params based on the params and validate them', function() {
      req.params.offset = 7;
      req.params.limit = 1500;
      paginator.paginate(req, res, function() {
        should.exist(req.params.offset);
        should.exist(req.params.limit);
        req.params.offset.should.equal(7);
        req.params.limit.should.equal(100);
      });
    });
  });
});