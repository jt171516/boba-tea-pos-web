import express from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import passport from "passport";
import "./auth.js";

dotenv.config();

// Check if user is logged in
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

// set up PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
});

// Express app setup
const app = express();
const PORT = 5001;

// Set up session and passport middleware
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { secure: false } }));
app.use(passport.initialize());
app.use(passport.session());

// Configure CORS
const corsOptions = {
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true
};
  
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet()); //security middleware to provide HTTPS headers
app.use(morgan("dev")); //log all requests

// Route test
app.get("/", (req,res) => {
    console.log(res.getHeaders());
    res.send("Hello from the backend");
})

// Route to get all items
app.get("/api/item", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM item");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get all inventory items
app.get("/api/inventory", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM inventory");
        console.log("Fetched inventory data:", result.rows); // Debugging log
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Initiate Google authentication
app.get('/auth/google', (req, res, next) => {
    const redirectUrl = req.query.state || '/';
    req.session.redirectTo = redirectUrl;
    passport.authenticate('google', { scope: ['email', 'profile'], state: redirectUrl })(req, res, next);
});

// Callback route for authentication
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    (req, res) => {
      const redirectUrl = req.query.state || '/';
      req.session.redirectTo = null;
      res.redirect(redirectUrl);
    }
);

// Redirect for failed authentication
app.get('/auth/failure', (req, res) => {
    const redirectUrl = req.session.redirectTo || '/';
    req.session.redirectTo = null
    res.redirect(`${redirectUrl}?loginFailure=true`);
});

// Protected route to check if user is logged in
app.get('/auth/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}, you are authenticated!`);
});

// Logout route
app.get('/auth/logout', (req, res) => {
    const redirectUrl = req.query.state || '/';
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect(`${redirectUrl}?logout=true`);
    });
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})