var should    = require('should');
var paginator = require('../../utils/paginator');

/**
 * Tests for the pagination functions
 */
describe('Paginator', function() {
  var req, res;
  beforeEach(function() {
    req = {};
    req.params = {};
    res = {};
  });

  it('should set a defaults pagination params in the req', function() {
    paginator.paginate(req, res, function() {
      should.exist(req.params.offset);
      should.exist(req.params.limit);
      req.params.offset.should.equal(0);
      req.params.limit.should.equal(10);
    });
  });

  it('should set pagination params based on the params', function() {
    req.params.offset = 3;
    req.params.limit = 23;
    paginator.paginate(req, res, function() {
      should.exist(req.params.offset);
      should.exist(req.params.limit);
      req.params.offset.should.equal(3);
      req.params.limit.should.equal(23);
    });
  });

  it('should set pagination params based on the params and validate them', function() {
    req.params.offset = 7;
    req.params.limit = 1500;
    paginator.paginate(req, res, function() {
      should.exist(req.params.offset);
      should.exist(req.params.limit);
      req.params.offset.should.equal(7);
      req.params.limit.should.equal(100);
    });
  });

  it('should return correct links section based on the params', function() {
    var req = {};
    req.url = 'http://api.reelyactive.com/v1';
    var type = 'tags';
    var offset = 30;
    var limit = 15;
    var totalCount = 57;
    var links = paginator.createLinks(req, type, offset, limit, totalCount);
    req.url += '/' + type;

    links.self.href.should.equal(req.url+'?offset='+offset+'&limit='+limit);
    links.first.href.should.equal(req.url+'?offset=0&limit='+limit);
    links.next.href.should.equal(req.url+'?offset=45&limit='+limit);
    links.prev.href.should.equal(req.url+'?offset=15&limit='+limit);
    links.last.href.should.equal(req.url+'?offset=45&limit='+limit);
  });
});