module.exports = function(server) {
  server.get('/', entryPoint);
  server.get('/404', notFound);
};

function entryPoint(req, res, next) {
  res.json(200, {'status': 'Works !'});
  return next();
}

function notFound (req, res, next) {
  res.json(404, { code: 404, message: 'Ressource not found' });
  return next();
}