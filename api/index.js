const mongoose = require('../backend/node_modules/mongoose');
const app = require('../backend/app');
let connection;

// Reuse one connection pool across warm Vercel invocations.
module.exports = async (req, res) => {
 try {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
   throw new Error('Missing server configuration');
  }
  if (!connection) {
   connection = mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize:5, maxIdleTimeMS:60000, serverSelectionTimeoutMS:10000
   }).then(async () => {
    await Promise.all([
     require('../backend/models/User').init(),
     require('../backend/models/Event').init(),
     require('../backend/models/Registration').init()
    ]);
   }).catch(error => {connection = undefined; throw error;});
  }
  await connection;
  return app(req, res);
 } catch {
  res.status(503).json({message:'Service temporarily unavailable'});
 }
};
