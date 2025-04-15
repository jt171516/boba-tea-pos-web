import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

// Configure Google OAuth 2.0 strategy using Passport.js
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CURRENT_LOCALHOST}/auth/google/callback`,
    scope: ["profile", "email"],
    passReqToCallback: true
  },
  // Authentication is successful if the user is from TAMU
  function(request, accessToken, refreshToken, profile, done) {
    if (!profile._json.hd || profile._json.hd.toLowerCase() !== "tamu.edu") {
      return done(null, false, { message: 'Only TAMU accounts are allowed.' });
    }
    else {
      return done(null, profile);
    }
   }
));

// Serialize and deserialize user information
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});