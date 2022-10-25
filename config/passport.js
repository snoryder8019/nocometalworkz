const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const flash = require('express-flash')
const bcrypt = require('bcrypt')
const User = require('../models/User')
module.exports = function(passport){
  
  passport.use(new LocalStrategy({
    email: 'email',
    password: 'password',   
  },
  function(email , password, done) {
    console.log("profile")
    User.findOne({ 'email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false);
      if (!user.validPassword(password))
          return done(null, false);
      return done(null, user);
    });
  }));
  //google and facebook strat below here
  passport.use(new GoogleStrategy ({
      clientID:process.env.GGLCID,
      clientSecret:process.env.GGLSEC,
      callbackURL:'/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
      const newUser = {       
        googleId: profile.id,
        email:profile.emails[0].value,
        displayName: profile.displayName,
        firstName:profile.name.givenName,
        lastName:profile.name.familyName,
        password:"",
        isAdmin:false,
        image: profile.photos[0].value
      }
      try{
        console.log()
          let user = await User.findOne({providerId:profile.id})
          if(user){
           console.log('if user true')
            done(null,user)
            }else{
             console.log('if user false')
             user = await User.create(newUser)
             done(null,user)
              }
        }catch (err){
      console.error(err)
          }
  }))
////////
passport.use(new FacebookStrategy({
  clientID: process.env.FBAPPID,
  clientSecret: process.env.FBAPPSEC,
  callbackURL: 'localhost:8282/auth/facebook/callback',
  profileFields: ['id', 'email', 'first_name', 'last_name'],
},
function(token, refreshToken, profile, done) {
  process.nextTick(function() {
    User.findOne({ "email":email }, function(err, user) {
      if (err)
        return done(err);
      if (user) {
        console.log(profile)
        return done(null, user);
      } else {
        //var newUser = new User();
        // newUser.facebook.id = profile.id;
        // newUser.facebook.token = token;
        // newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
        // newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

        newUser.save(function(err) {
          if (err)
            throw err;
          return done(null, newUser);
        });
      }
    });
  });
}));

////////////
  passport.serializeUser((user, done)=> {     
     done(null, user._id)
    })
  passport.deserializeUser(( id, done)=>{        
        User.findById(id, (err, user)=> done(err,user))    
    })

  }
