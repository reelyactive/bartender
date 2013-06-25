var should    = require('should');
var paginator = require('../../utils/paginator');

/**
 * Tests for the pagination functions
 */
describe('Paginator', function() {
  var req, res;
  beforeEach(function() {
    req        = {};
    req.params = {};
    res        = {};
  });

  it('should set a defaults pagination params in the req', function() {
    paginator.paginate(req, res, function() {
      should.exist(req.params.page);
      should.exist(req.params.perpage);
      req.params.page.should.equal(0);
      req.params.perpage.should.equal(10);
    });
  });

  it('should set pagination params based on the params', function() {
    req.params.page    = 3;
    req.params.perpage = 23;
    paginator.paginate(req, res, function() {
      should.exist(req.params.page);
      should.exist(req.params.perpage);
      req.params.page.should.equal(3);
      req.params.perpage.should.equal(23);
    });
  });

  it('should set pagination params based on the params and validate them', function() {
    req.params.page    = -23;
    req.params.perpage = 1500;
    paginator.paginate(req, res, function() {
      should.exist(req.params.page);
      should.exist(req.params.perpage);
      req.params.page.should.equal(0);
      req.params.perpage.should.equal(100);
    });
  });

  it('should calculate correct pages on a standard case', function() {
    var page       = 2;
    var perpage    = 15;
    var totalCount = 57;
    var pages      = paginator.calculatePages(page, perpage, totalCount);
    pages.prev.should.equal(1);
    pages.next.should.equal(3);
    pages.last.should.equal(3);
  });

  it('should calculate correct pages on a default case', function() {
    var page       = 0;
    var perpage    = 10;
    var totalCount = 57;
    var pages      = paginator.calculatePages(page, perpage, totalCount);
    should.not.exist(pages.prev);
    pages.next.should.equal(1);
    pages.last.should.equal(5);
  });

  it('should calculate correct pages when totalCount is less than perpage', function() {
    var page       = 0;
    var perpage    = 10;
    var totalCount = 7;
    var pages      = paginator.calculatePages(page, perpage, totalCount);
    should.not.exist(pages.prev);
    should.not.exist(pages.next);
    pages.last.should.equal(0);
  });

  it('should calculate correct pages on no result', function() {
    var page       = 0;
    var perpage    = 10;
    var totalCount = 0;
    var pages      = paginator.calculatePages(page, perpage, totalCount);
    should.not.exist(pages.prev);
    should.not.exist(pages.next);
    should.not.exist(pages.last);
  });

  it('should calculate correct pages on a weird case', function() {
    var page       = 5;
    var perpage    = 15;
    var totalCount = 20;
    var pages      = paginator.calculatePages(page, perpage, totalCount);
    pages.prev.should.equal(1);
    should.not.exist(pages.next);
    pages.last.should.equal(1);
  });

  it('should calculate correct pages on a weird case', function() {
    var page       = 50;
    var perpage    = 10;
    var totalCount = 23;
    var pages      = paginator.calculatePages(page, perpage, totalCount);
    pages.prev.should.equal(2);
    should.not.exist(pages.next);
    pages.last.should.equal(2);
  });

  it('should calculate correct pages on a weird case', function() {
    var page       = 50;
    var perpage    = 30;
    var totalCount = 20;
    var pages      = paginator.calculatePages(page, perpage, totalCount);
    pages.prev.should.equal(0);
    should.not.exist(pages.next);
    pages.last.should.equal(0);
  });

  it('should return correct links section based on the params', function() {
    var req        = {};
    req.url        = 'http://api.reelyactive.com/v1';
    var type       = 'tags';
    var page       = 2;
    var perpage    = 15;
    var totalCount = 57;
    var links      = paginator.createLinks(req, type, page, perpage, totalCount);
    req.url += '/' + type;

    links.self.href.should.equal(req.url+'?page='+page+'&perpage='+perpage);
    links.first.href.should.equal(req.url+'?page=0&perpage='+perpage);
    links.prev.href.should.equal(req.url+'?page=1&perpage='+perpage);
    links.next.href.should.equal(req.url+'?page=3&perpage='+perpage);
    links.last.href.should.equal(req.url+'?page=3&perpage='+perpage);
  });
});