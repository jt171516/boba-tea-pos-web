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
        console.log("Fetched inventory data:", result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to get an item by name
app.get("/api/item/:name", async (req, res) => {
    const itemName = req.params.name;
    try {
        const result = await pool.query("SELECT * FROM item WHERE name = $1", [itemName]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get modifiers based on selected options
app.post("/api/modifiers", async (req, res) => {
    //Receive selected modifiers from the frontend
    const {size, sugar, ice, toppings} = req.body; 
    try {
        const modifiers = [];
        for (const topping of toppings){
            const result = await pool.query("SELECT id FROM modifier WHERE size = $1 AND sweetness_level = $2 AND ice_level = $3 AND topping = $4", 
                [size, sugar, ice, topping]
            );
            if (result.rows.length > 0) {
                modifiers.push(result.rows[0]); //Push the modifier ID to the array
            }
        }
        res.json(modifiers); //Return all matching modifiers IDs
    } catch (error) {
        console.error("Error fetching modifiers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Route to insert into ordersitemmodifierjunction table
app.post("/api/ordersitemmodifierjunction", async (req, res) => {
    //Receive item ID and modifier IDs from the frontend
    const { itemId, modifiers} = req.body; 
    
    console.log("Received itemId:", itemId);
    console.log("Received modifiers_id:", modifiers);

    try {
        for (const modifier of modifiers){
            await pool.query(
                "INSERT INTO ordersitemmodifierjunction (orderitemid, modifierid, qty) VALUES ($1, $2, $3)",
                [itemId, modifier, 1]
            );
        }
        res.status(201).json({ message: "Modifiers inserted successfully" });
    } catch (error) {
        console.error("Error inserting into ordersitemmodifierjunction:", error);
        res.status(500).json({ error: "Internal server error" });
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