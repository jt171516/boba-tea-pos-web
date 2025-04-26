import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import pg from "pg";

dotenv.config();

// set up PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
});

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
  async (accessToken, refreshToken, profile, done) => {

    try {
      const userEmail = profile.emails[0].value;

      const { rows } = await pool.query(`SELECT * FROM employee WHERE email = $1`, [userEmail]);

      if (rows.length === 0) {
        return done(null, false, { message: 'Employee not found in database.' });
      }

      const user = {
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
        manager: rows[0].manager,
      };

      return done(null, user);
    }
    catch (error) {
      return done(error, false);
    }
  }
));