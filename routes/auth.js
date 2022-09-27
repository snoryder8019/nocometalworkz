const express = require('express');
const passport = require('passport');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();


router.get('/google', passport.authenticate(
  'google',
  {scope:['profile','email','openid']},
  {failureRedirect:'login'}),
  // (req,res)=>{
  //    res.redirect('/admin')}
  )

router.get('/google/callback', passport.authenticate(
  'google',
   {failureRedirect:'login'}),
  (req,res)=>{
   res.redirect('/market')
  })


  router.get('/logout', function(req, res, next) {
    req.logout(function(err){
      if(err){return next(err)}
      res.redirect('/');
    }
    );
  });
module.exports = router;