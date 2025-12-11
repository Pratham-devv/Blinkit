import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index"


dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
}));
app.use(express.json());

app.use("/api", routes);



export default app;
