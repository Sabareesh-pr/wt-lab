require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
(async () => {
 try {
  await mongoose.connect(process.env.MONGO_URI);
  for (const event of [
   {name:'Coding Contest',category:'Technical',fee:100,seats:50},
   {name:'Web Dev Workshop',category:'Workshop',fee:300,seats:60},
   {name:'Cultural Night',category:'Cultural',fee:0,seats:200}
  ]) await Event.updateOne({name:event.name}, {$setOnInsert:event}, {upsert:true});
  console.log('Seed complete');
 } catch {console.error('Seed failed');process.exitCode=1;}
 finally {await mongoose.disconnect();}
})();
