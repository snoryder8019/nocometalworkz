const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GGLCID,
    clientSecret: process.env.GGLSEC,
    callbackURL: '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) return done(null, user);

      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
      const email = profile.emails[0]?.value || '';
      const isAdmin = adminEmails.includes(email);

      user = await User.create({
        googleId: profile.id,
        displayName: profile.displayName,
        email,
        avatar: profile.photos[0]?.value || null,
        isAdmin
      });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
