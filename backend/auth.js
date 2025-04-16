import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";

dotenv.config();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

// JWT strategy for authenticating users with JWT tokens
passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    if (jwtPayload.user) {
        return done(null, jwtPayload.user);
    }
    return done(null, false);
}));

// Configure Google OAuth 2.0 strategy using Passport.js
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CURRENT_LOCALHOST}/auth/google/callback`,
    scope: ["profile", "email"],
  },
  // Authentication is successful if the user is from TAMU
  (accessToken, refreshToken, profile, done) => {
    if (!profile._json.hd || profile._json.hd.toLowerCase() !== "tamu.edu") {
      return done(null, false, { message: 'Only TAMU accounts are allowed.' });
    }
    else {
      return done(null, profile);
    }
   }
));