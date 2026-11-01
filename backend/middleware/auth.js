const jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
 try {
  req.user = jwt.verify(req.cookies.session, process.env.JWT_SECRET, {algorithms: ['HS256']});
  next();
 } catch { res.status(401).json({message: 'Please log in'}); }
};
module.exports.admin = (req,res,next) => req.user.role === 'admin' ? next() : res.status(403).json({message: 'Admin access required'});
