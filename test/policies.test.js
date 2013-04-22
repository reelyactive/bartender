var should = require('should');
var validator = require('../utils/validator');
var pagination = require('../utils/pagination');


describe('Policies validation', function() {

  describe('Validator testing', function() {
    var req, res;
    beforeEach(function() {
      req = {};
      req.params = {};
      res = {};
    });

    describe('Require id', function() {
      it('should set an error if an "id" isn\'t present in the req.params', function() {
        validator.requireId(req, res, function() {
          should.not.exist(req.params.id);
          should.exist(req.error);
        });
      });

      it('should check if an "id" is present in the req.params', function() {
        req.params.id = '00-10-00-57';
        validator.requireId(req, res, function() {
          should.exist(req.params.id);
          should.not.exist(req.error);
        });
      });
    });

    describe('Require uids', function() {
      it('should set an error if an "uids" isn\'t present in the req.params', function() {
        validator.requireUids(req, res, function() {
          should.not.exist(req.params.uids);
          should.exist(req.error);
        });
      });

      it('should check if an "uids" is present in the req.params', function() {
        req.params.uids = '00-10-00-57';
        validator.requireUids(req, res, function() {
          should.exist(req.params.uids);
          should.not.exist(req.error);
        });
      });
    });

    describe('Require accountUid', function() {
      it('should set an error if an "accountUid" isn\'t present in the req.params', function() {
        validator.requireAccountUid(req, res, function() {
          should.not.exist(req.params.accountUid);
          should.exist(req.error);
        });
      });

      it('should check if an "accountUid" is present in the req.params', function() {
        req.params.accountUid = '132';
        validator.requireAccountUid(req, res, function() {
          should.exist(req.params.accountUid);
          should.not.exist(req.error);
        });
      });
    });

    describe('Require deviceUid', function() {
      it('should set an error if an "deviceUid" isn\'t present in the req.params', function() {
        validator.requireDeviceUid(req, res, function() {
          should.not.exist(req.params.deviceUid);
          should.exist(req.error);
        });
      });

      it('should check if an "deviceUid" is present in the req.params', function() {
        req.params.deviceUid = '00-10-00-57';
        validator.requireDeviceUid(req, res, function() {
          should.exist(req.params.deviceUid);
          should.not.exist(req.error);
        });
      });
    });
  });

  describe('Paginator', function() {
    var req, res;
    beforeEach(function() {
      req = {};
      req.params = {};
      res = {};
    });

    it('should set a default pagination object in the req', function() {
      pagination.paginate(req, res, function() {
        should.exist(req.params.pagination);
        should.exist(req.params.pagination.offset);
        should.exist(req.params.pagination.limit);
        req.params.pagination.offset.should.equal(0);
        req.params.pagination.limit.should.equal(10);
      });
    });

    it('should set a pagination object based on the params', function() {
      req.params.offset = 3;
      req.params.limit = 23;
      pagination.paginate(req, res, function() {
        should.exist(req.params.pagination);
        should.exist(req.params.pagination.offset);
        should.exist(req.params.pagination.limit);
        req.params.pagination.offset.should.equal(3);
        req.params.pagination.limit.should.equal(23);
      });
    });

    it('should set a pagination object based on the params', function() {
      req.params.offset = 7;
      req.params.limit = 1500;
      pagination.paginate(req, res, function() {
        should.exist(req.params.pagination);
        should.exist(req.params.pagination.offset);
        should.exist(req.params.pagination.limit);
        req.params.pagination.offset.should.equal(7);
        req.params.pagination.limit.should.equal(100);
      });
    });
  });
});