jest.mock('mongoose', () => ({connect:jest.fn().mockResolvedValue(undefined)}));
jest.mock('../app', () => jest.fn((req,res) => res.status(200).json({ok:true})));
jest.mock('../models/User', () => ({init:jest.fn().mockResolvedValue(undefined)}));
jest.mock('../models/Event', () => ({init:jest.fn().mockResolvedValue(undefined)}));
jest.mock('../models/Registration', () => ({init:jest.fn().mockResolvedValue(undefined)}));
const response = () => ({status:jest.fn().mockReturnThis(),json:jest.fn(),setHeader:jest.fn(),end:jest.fn()});
beforeEach(() => {
 jest.resetModules();
 process.env.MONGO_URI='mongodb://test-only/techfest2026';
 process.env.JWT_SECRET='test-only-secret-at-least-32-characters';
});
test('concurrent function requests reuse one database connection',async () => {
 const handler=require('../../api/index');
 await Promise.all([handler({},response()),handler({},response())]);
 expect(require('mongoose').connect).toHaveBeenCalledTimes(1);
 expect(require('../app')).toHaveBeenCalledTimes(2);
});
test('failed database connection returns safe error and can retry',async () => {
 const mongoose=require('mongoose');
 mongoose.connect.mockRejectedValueOnce(new Error('private connection information'));
 const handler=require('../../api/index');
 const res=response();
 await handler({},res);
 expect(res.statusCode).toBe(503);
 expect(res.end).toHaveBeenCalledWith(JSON.stringify({message:'Service temporarily unavailable'}));
 await handler({},response());
 expect(mongoose.connect).toHaveBeenCalledTimes(2);
 expect(require('../app')).toHaveBeenCalledTimes(1);
});
test('missing configuration never dispatches requests',async () => {
 delete process.env.JWT_SECRET;
 const res=response();
 await require('../../api/index')({},res);
 expect(res.statusCode).toBe(503);
 expect(require('../app')).not.toHaveBeenCalled();
});
