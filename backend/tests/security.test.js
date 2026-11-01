process.env.JWT_SECRET = 'test-only-secret-with-at-least-32-characters';
const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const app = require('../app');
afterEach(() => jest.restoreAllMocks());
test('anonymous session discovery is quiet while private data stays protected', async() => {
 const session = await request(app).get('/api/auth/me');
 expect(session.status).toBe(200); expect(session.body).toEqual({user:null});
 expect((await request(app).get('/api/registrations/mine')).status).toBe(401);
});
test('NoSQL operators rejected before querying', async() => {
 const find = jest.spyOn(User,'findOne');
 const res = await request(app).post('/api/auth/login').send({email:{$ne:null},password:'password123'});
 expect(res.status).toBe(400); expect(find).not.toHaveBeenCalled();
});
test('security headers are present', async() => {
 const res=await request(app).get('/api/health');
 expect(res.headers['content-security-policy']).toContain("script-src 'self'");
 expect(res.headers['x-content-type-options']).toBe('nosniff');
});
test('cross-site state changes blocked', async() => {
 expect((await request(app).post('/api/auth/logout').set('Origin','https://evil.example').send({})).status).toBe(403);
});
test('unauthenticated booking rejected', async() => {expect((await request(app).post('/api/registrations').send({eventId:'507f1f77bcf86cd799439011'})).status).toBe(401);});
test('ordinary users cannot edit events', async() => {
 const token=jwt.sign({id:'507f1f77bcf86cd799439011',role:'user'},process.env.JWT_SECRET);
 expect((await request(app).post('/api/events').set('Cookie',`session=${token}`).send({})).status).toBe(403);
});
test('login uses secure cookie and does not return JWT',async() => {
 jest.spyOn(User,'findOne').mockReturnValue({select:jest.fn().mockResolvedValue({id:'507f1f77bcf86cd799439011',name:'Test',role:'user',password:await bcrypt.hash('password123',4)})});
 process.env.NODE_ENV='production';
 const res=await request(app).post('/api/auth/login').send({email:'test@example.com',password:'password123'});
 process.env.NODE_ENV='test';
 expect(res.status).toBe(200); expect(res.body.token).toBeUndefined();
 expect(res.headers['set-cookie'][0]).toMatch(/HttpOnly/); expect(res.headers['set-cookie'][0]).toMatch(/Secure/); expect(res.headers['set-cookie'][0]).toMatch(/SameSite=Strict/);
});
test('internal errors do not leak details',async() => {
 jest.spyOn(User,'findOne').mockReturnValue({select:jest.fn().mockRejectedValue(new Error('secret database address'))});
 const res=await request(app).post('/api/auth/login').send({email:'test@example.com',password:'password123'});
 expect(res.status).toBe(500); expect(JSON.stringify(res.body)).not.toContain('secret');
});
