module.exports = (err,req,res,next) => {
 const status = err.code === 11000 ? 409 : err.status || (['ValidationError','CastError'].includes(err.name) ? 400 : 500);
 res.status(status).json({message: status === 409 ? 'Already registered' : status >= 500 ? 'Server error' : 'Invalid request'});
};
