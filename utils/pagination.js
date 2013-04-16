/**
 * Construct a pagination object from request params
 * and attach it to the request param
 * req.params.offset can't be less than 0
 * req.params.limit can't be more than 100
 * @param  {[type]}   req  request
 * @param  {[type]}   res  response
 * @param  {Function} next callback
 */
function paginate(req, res, next) {
  var params = req.params;

  // ! Mongoose call it limit !
  var offset = params.offset || 0;
  var limit = params.limit || 10;
  if(offset < 0) {
    offset = 0;
  }

  if(limit > 100 ) {
    limit = 100;
  }

  var pagination = {
    offset: offset,
    limit: limit
  };

  params.pagination = pagination;

  return next();
};

exports.paginate = paginate;