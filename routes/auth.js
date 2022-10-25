const express = require('express');
const passport = require('passport');
const { ensureAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/login', 
  passport.authenticate('local', 
  { failureRedirect: '/login' },
  function(req, res) {
   return res.redirect('/');
  }));

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