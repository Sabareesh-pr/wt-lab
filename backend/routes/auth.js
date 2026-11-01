const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {body} = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const User = require('../models/User');
const credentials = [body('email').isString().isEmail().isLength({max:254}).trim().toLowerCase(), body('password').isString().isLength({min:8,max:72}).custom(v => Buffer.byteLength(v) <= 72), validate];
const cookie = () => ({httpOnly:true, secure:process.env.NODE_ENV === 'production', sameSite:'strict', path:'/api', maxAge:2*60*60*1000});
router.post('/signup', body('name').isString().trim().isLength({min:1,max:80}), ...credentials, async(req,res,next) => {
 try { const user = await User.create({name:req.body.name, email:req.body.email, password:await bcrypt.hash(req.body.password,12)}); res.status(201).json({message:'Account created. Please log in.', userId:user.id}); } catch(e){next(e);}
});
router.post('/login', ...credentials, async(req,res,next) => {
 try {
 const user = await User.findOne({email:req.body.email}).select('+password');
 if(!user || !await bcrypt.compare(req.body.password,user.password)) return res.status(401).json({message:'Invalid email or password'});
 const token = jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'2h', algorithm:'HS256'});
 res.cookie('session',token,cookie()).json({user:{id:user.id,name:user.name,role:user.role}});
 } catch(e){next(e);}
});
router.get('/me', auth, (req,res) => res.json({user:req.user}));
router.post('/logout', (req,res) => {const options=cookie(); delete options.maxAge; res.clearCookie('session',options).json({message:'Logged out'});});
module.exports = router;
