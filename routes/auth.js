const express = require('express');
const passport = require('passport');

const client = require('../config/mongo');
const bcrypt = require('bcrypt')
const dbName= 'nocoMetal';
const router = express.Router();


// router.post('/checkCreds', function(req, res, next) {
//   passport.authenticate('local',
//    function(err, user) {
//     if (err) { return next(err); }
//     if (!user) {
//       console.log('no user created')
//        // authentication failed, redirect to the login page    
//       return res.redirect('/login');
//     }
//     // authentication was successful, save the user object to the session
//     req.logIn(user, function(err) {
//       console.log(user)
//       if (err) { return next(err); }
//       // redirect to the home page
//       return res.redirect('/');
//     });
//   })(req, res, next);
// });
// Create a route to handle the login request
router.post('/checkCreds',
  passport.authenticate('local',{successReturnToOrRedirect:'/market',failureRedirect: '/login',keepSessionInfo:true }),
  
);


// const router = express.Router();
// router.post('/checkCreds',passport.authenticate('local',{failureRedirect:'/login'}))
//////////
// router.post('/checkCreds', function(req,res){  
//   async function creds(){
//     try {
//       await client.connect();
//       await grabCreds(client);
//      }
//      catch(err){
//        console.log(err);
//      }
//      finally{
//      await client.close();
//    }}
//   ////////////////// 
//  creds().catch(console.error);
// ///////////////////
//    async function grabCreds(client){
//     const user = await client.db(dbName).collection('users').findOne({"email":req.body.email});     
//     if(!user || !user.password){
//       console.log('no user or password')
//       return res.redirect('/login')}           
//         await bcrypt.compare(req.body.password,user.password, function(err,match){        
//       if (err){throw err}
//       if(match==true){
//         console.log('pass good')

//         req.login(user, (err) => {
//           if (err) { return next(err); }
//           // Redirect the user to the protected page they were trying to access
//           return res.redirect('/market')
        
//         });

  
//         }      
//         else{
//         console.log('bad pass')
//         res.redirect('/login')
//         }
//      })
//     }
//    }
// )

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
    const user=req.user
    console.log(user)
    const sessionUser = req.session.user
    console.log(sessionUser)
    if(user)
    req.logout(function(err){
      if(err){return next(err)}
    })  
   if(sessionUser){
        req.session.destroy(function(err){
          if(err){return next(err)}})
  }
              
        return  res.redirect('/'); })


        
      

    
  

 

module.exports = router;