// Catches anything thrown/passed to next(err) so the server never crashes
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server"
  });
}

module.exports = errorHandler;
