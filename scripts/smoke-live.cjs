const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const base = process.argv[2];
if (!base?.startsWith('https://')) throw new Error('Pass the HTTPS deployment origin');
const observations = {};
let cookie;
async function call(path, method = 'GET', body) {
 const response = await fetch(`${base}/api${path}`, {
  method, headers: {'Content-Type':'application/json', Origin:base, ...(cookie ? {Cookie:cookie} : {})},
  ...(body ? {body:JSON.stringify(body)} : {}), signal:AbortSignal.timeout(30000)
 });
 return {response, data:await response.json()};
}
(async () => {
 const health = await call('/health'); assert.equal(health.response.status,200);
 observations.health = health.data.status;
 observations.securityHeaders = {
  csp:!!health.response.headers.get('content-security-policy'),
  hsts:!!health.response.headers.get('strict-transport-security'),
  nosniff:health.response.headers.get('x-content-type-options') === 'nosniff'
 };
 const email = `deployment-${Date.now()}@example.com`;
 const password = crypto.randomBytes(24).toString('hex');
 const signup = await call('/auth/signup','POST',{name:'Deployment check',email,password});
 assert.equal(signup.response.status,201); observations.signup = 201;
 const login = await call('/auth/login','POST',{email,password});
 assert.equal(login.response.status,200); assert.equal(login.data.token,undefined);
 const setCookie = login.response.headers.get('set-cookie');
 assert.match(setCookie,/HttpOnly/i); assert.match(setCookie,/Secure/i); assert.match(setCookie,/SameSite=Strict/i);
 cookie = setCookie.split(';')[0]; observations.loginCookie = 'HttpOnly; Secure; SameSite=Strict';
 assert.equal((await call('/auth/me')).response.status,200);
 observations.adminRejected = (await call('/events','POST',{})).response.status;
 assert.equal(observations.adminRejected,403);
 const events = (await call('/events')).data;
 assert.ok(events.length > 0);
 const event = events.find(e => e.fee === 0 && e.seats > 0) || events.find(e => e.seats > 0);
 assert.ok(event);
 assert.equal((await call('/registrations','POST',{eventId:event._id})).response.status,201);
 assert.equal((await call('/registrations','POST',{eventId:event._id})).response.status,409);
 const after = (await call(`/events/${event._id}`)).data;
 assert.equal(after.seats,event.seats - 1);
 assert.equal((await call('/registrations/mine')).data.length,1);
 observations.booking = 'Persisted; duplicate rejected; seat decremented exactly once';
 const logout = await call('/auth/logout','POST',{});
 assert.equal(logout.response.status,200); assert.match(logout.response.headers.get('set-cookie'),/Expires=Thu, 01 Jan 1970/i);
 cookie = undefined;
 const anonymous = await call('/auth/me');
 assert.equal(anonymous.response.status,200); assert.equal(anonymous.data.user,null);
 assert.equal((await call('/registrations/mine')).response.status,401);
 observations.logout = 'Cookie cleared; public session state is null; protected data rejected';
 observations.testAccount = email;
 observations.origin = base;
 observations.checkedAt = new Date().toISOString();
 fs.mkdirSync('docs/evidence',{recursive:true});
 fs.writeFileSync('docs/evidence/live-smoke.json',JSON.stringify(observations,null,2)+'\n');
 console.log(JSON.stringify(observations,null,2));
})().catch(error => {console.error('Live smoke check failed:', error.message);process.exitCode=1;});
