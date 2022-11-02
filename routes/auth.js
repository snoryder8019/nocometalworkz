const express = require('express');
const passport = require('passport');
const { MongoClient} = require('mongodb');
const session = require('express-session')
const client = require('../config/mongo');
const bcrypt = require('bcrypt')
const alert = require('alert');
const dbName= 'nocoMetal';
const imageFP = 'nocometalworkz'
const { ensureAuth } = require('../middleware/auth');
const cookieParser = require('cookie-parser');
const router = express.Router();

//////////
router.post('/checkCreds', function(req,res){  
  async function creds(){
    try {
      await client.connect();
      await grabCreds(client);
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
  ////////////////// 
 creds().catch(console.error);
///////////////////
   async function grabCreds(client){
    const user = await client.db(dbName).collection('users').findOne({"email":req.body.email}); 
    
    if(!user || !user.password){
      console.log('no user or password')
      return res.redirect('/login')}
           
        await bcrypt.compare(req.body.password,user.password, function(err,match){
        
      if (err){throw err}

      if(match==true){
        console.log('pass good')
     // req.cookie.set(req.session._id)
      console.log(req.session.id)
      req.session.user = user
      
      console.log(req.session.user)
      return res.redirect('/market')
        }      
        else{
        console.log('bad pass')
        res.redirect('/login')
        }
     })
    }
   }
)

//////////
router.get('/google', 
passport.authenticate('google',
  {scope:['profile','email','openid']},
  {failureRedirect:'login'}));

router.get('/google/callback', 
passport.authenticate('google',
   {failureRedirect:'login'}),
  (req,res)=>{
   res.redirect('/market')});

router.get('/facebook',
  passport.authenticate('facebook',
{scope:['email', 'id']},
 // {successRedirect:'/'},
  {failureRedirect:'/login'}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', 
  {successRedirect:'/'},
  {failureRedirect: '/login' }));  

  router.get('/logout', function(req, res, next) {
    req.logout(function(err){
      if(err){return next(err)}
    return  res.redirect('/'); })});

 

module.exports = router;