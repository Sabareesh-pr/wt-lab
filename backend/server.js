require('dotenv').config();
const mongoose = require('mongoose');
async function start() {
 if (!process.env.MONGO_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('Set MONGO_URI and a JWT_SECRET of at least 32 characters');
 if (process.env.NODE_ENV === 'production' && !process.env.APP_ORIGIN?.startsWith('https://')) throw new Error('Set HTTPS APP_ORIGIN');
 await mongoose.connect(process.env.MONGO_URI);
 await Promise.all([require('./models/User').init(), require('./models/Event').init(), require('./models/Registration').init()]);
 const server = require('./app').listen(process.env.PORT || 5000, () => console.log('TechFest server ready'));
 process.on('SIGTERM', () => server.close(() => mongoose.disconnect().then(() => process.exit(0))));
}
start().catch(err => {
 const causes = [...(err.reason?.servers?.values() || [])].map(server => ({name:server.error?.name,code:server.error?.cause?.code || server.error?.code,tls:/tls|ssl|certificate/i.test(server.error?.message || '')}));
 console.error('Startup failed', {name:err.name, code:err.code, authentication:/auth/i.test(err.message), causes});
 process.exit(1);
});
