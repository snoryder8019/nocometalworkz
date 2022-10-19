var express = require('express');
var router = express.Router();
const passport = require('passport')
const bcrypt = require('bcrypt');
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
  const user = req.user
  res.render('register', { title: 'Contact Us', user:user });
});
//////
// router.post('/loginUser', 
// passport.authenticate('local',
// {failureRedirect:'/login'},
// {successRedirect:'/'}
// ));
/////
router.post('/regUser', (req,res) => {
  var ipHit = req.ip;
  async function main(){
   try {
    await client.connect();
   // await checkEmail(client);
    await createUser(client,{    
      provider:'local', 
      providerId:'local'+Date.now(),
      name: req.body.name,
      email: req.body.email,    
      password:bcrypt.hash(req.body.password, 10),
      isAdmin: false,
      cart:[],
      createdAt: Date.now()

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
  const emailCheck = await client.db(dbName).collection('users').findOne({email:req.body.email});
if(emailCheck.email===req.body.email){
}else{
  console.log('tayken')}
}
///
    async function createUser(client,newUser){
      const emailCheck = await client.db(dbName).collection('users').findOne({email:req.body.email});
      if(emailCheck){
        console.log(emailCheck);
        throw Error('TAYKEN');
        res.redirect('/login')
            }else{
   const result = await client.db(dbName).collection("users").insertOne(newUser);
   const data = await client.db(dbName).collection("blogs").find().toArray();
   const user= req.user
   console.log(' :new user\n id: '+result.insertedId+'\n email: '+ req.body.email+'\nIP:'+ipHit );
   res.redirect('/login')}
   }
})

  module.exports = router;