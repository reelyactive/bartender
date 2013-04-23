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

    describe('Require macs', function() {
      it('should set an error if an "macs" isn\'t present in the req.params', function() {
        validator.requireMacs(req, res, function() {
          should.not.exist(req.params.macs);
          should.exist(req.error);
        });
      });

      it('should check if an "macs" is present in the req.params', function() {
        req.params.macs = '00-10-00-57';
        validator.requireMacs(req, res, function() {
          should.exist(req.params.macs);
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