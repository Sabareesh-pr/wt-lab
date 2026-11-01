const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const {rateLimit} = require('express-rate-limit');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({contentSecurityPolicy: {directives: {imgSrc: ["'self'", 'https://images.unsplash.com'], upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null}}}));
app.use(compression());
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());
app.use('/api', rateLimit({windowMs: 60000, limit: 120}));
// Same-origin JSON API: cross-site state changes are rejected before authentication.
app.use('/api', (req,res,next) => {
 res.set('Cache-Control', 'no-store');
 if (!['GET','HEAD','OPTIONS'].includes(req.method)) {
  const expected = process.env.APP_ORIGIN || 'http://localhost:5173';
  if ((req.headers.origin && req.headers.origin !== expected) || req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({message: 'Untrusted origin'});
  if (!req.is('application/json')) return res.status(415).json({message: 'JSON required'});
 }
 next();
});
app.get('/api/health', (req,res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({status: mongoose.connection.readyState === 1 ? 'ok' : 'database unavailable'}));
app.use('/api/auth', rateLimit({windowMs: 15*60000, limit: 30}), require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api', (req,res) => res.status(404).json({message: 'Not found'}));
app.use(express.static(path.join(__dirname,'../frontend/dist'), {maxAge: '1h', setHeaders(res,file) {if(file.includes(`${path.sep}assets${path.sep}`)) res.set('Cache-Control','public, max-age=31536000, immutable');}}));
app.get('/{*path}', (req,res,next) => res.sendFile(path.join(__dirname,'../frontend/dist/index.html'), {headers: {'Cache-Control':'no-cache'}}, err => err && next(err)));
app.use(require('./middleware/errorHandler'));
module.exports = app;
