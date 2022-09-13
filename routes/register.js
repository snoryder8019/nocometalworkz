var express = require('express');
var router = express.Router();
const app = express();
const { MongoClient} = require('mongodb');
var client = require('../config/mongo');
const alert = require('alert');
const dbName= 'nocoMetal';
// const multer = require('multer');
// const upload = multer({dest:'tmp/uploads'});
// const path = require('path');
// const fs = require('fs')

//middleware
router.use((req,res,next)=>{
 
  next();
//fs to read photo file length
 })
router.get('/', (req,res,next) =>{

  next();
})
//
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Contact Us' });
});
router.post('/registerUser', (req,res) => {
  var ipHit = req.ip;
  async function main(){
   try {
    await client.connect();
   // await checkEmail(client);
    await createUser(client,{
      type:req.body.regType,
      name: req.body.fname,
      email: req.body.email,
      agree : req.body.agree,
      message:req.body.message
    });
  }catch (err){
    console.log(err)
  }finally{
    await client.close();
  }
  }
////
  main().catch(console.error);
///
async function checkEmail(client){
  const emailCheck = await client.db(dbName).collection('registry').findOne({email:req.body.email});
if(emailCheck.email===req.body.email){
}else{
  console.log('tayken')}
}
///
    async function createUser(client,newUser){
      const emailCheck = await client.db(dbName).collection('registry').findOne({email:req.body.email});
      if(emailCheck){
        console.log(emailCheck);
        res.render('register',{title:'email taken'})
        throw Error('TAYKEN');
            }else{
   const result = await client.db(dbName).collection("registry").insertOne(newUser);
   const data = await client.db(dbName).collection("blogs").find().toArray();
   console.log(' :new user\n id: '+result.insertedId+'\n email: '+ req.body.email+'\nIP:'+ipHit );
   res.render('index',{title:'thanks for registering! redirected Home.', data:data})}
   }
})

//multer trial
// router.post( '/upload',upload.single('photo'), (req,res, next)=>{
// //
// fs.readdir('./public/images/uploads', 'utf-8',(err,data)=>{
//   if (err){
//   console.log(err);
//   }
// const fileCount = data.length
//  })
// const ext = req.file.originalname.split(".")[1];
// const newFile = "uploadImage"+fileCount+"."+ext;
// console.log(newFile);
//   }
// );



  module.exports = router;