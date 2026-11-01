const router = require('express').Router();
const mongoose = require('mongoose');
const {body} = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
router.post('/', auth, body('eventId').isMongoId(), validate, async(req,res,next) => {
 const session = await mongoose.startSession();
 try {
 let registration;
 await session.withTransaction(async() => {
  const event = await Event.findOneAndUpdate({_id:req.body.eventId,seats:{$gt:0}}, {$inc:{seats:-1}}, {new:true,session});
  if(!event) {const e = new Error(); e.status=409; throw e;}
  [registration] = await Registration.create([{user:req.user.id,event:event.id}],{session});
 });
 res.status(201).json(registration);
 } catch(e){next(e);} finally {await session.endSession();}
});
router.get('/mine', auth, async(req,res,next) => {try {res.json(await Registration.find({user:req.user.id}).populate('event').lean());} catch(e){next(e);}});
module.exports = router;
