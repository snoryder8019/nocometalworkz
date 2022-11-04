const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const flash = require('express-flash')
const bcrypt = require('bcrypt')
const User = require('../models/User')
module.exports = function(passport){
 
  
  //google and facebook strat below here
  passport.use(new GoogleStrategy ({
      clientID:process.env.GGLCID,
      clientSecret:process.env.GGLSEC,
      callbackURL:'/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
      const newUser = {       
        googleId: profile.id,
        provider: "google",
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

  passport.serializeUser((user, done)=> {     
     done(null, user._id)
    })
  passport.deserializeUser(( id, done)=>{        
        User.findById(id, (err, user)=> done(err,user))    
    })

  }
