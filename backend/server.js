import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PSQL_PORT;

app.use(express.json());
app.use(cors());
app.use(helmet()); //security middleware to provide HTTPS headers
app.use(morgan("dev")); //log all requests


app.get("/", (req,res) => {
    console.log(res.getHeaders());
    res.send("Hello from the backend");
})

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})