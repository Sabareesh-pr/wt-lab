const {validationResult} = require('express-validator');
module.exports = (req,res,next) => validationResult(req).isEmpty() ? next() : res.status(400).json({message: 'Invalid input', errors: validationResult(req).array().map(e => ({field: e.path, message: e.msg}))});
