import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
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

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(helmet()); //security middleware to provide HTTPS headers
app.use(morgan("dev")); //log all requests


app.get("/", (req,res) => {
    console.log(res.getHeaders());
    res.send("Hello from the backend");
})

app.get("/item", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM item");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})