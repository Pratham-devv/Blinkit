import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index"


dotenv.config();
const allowedOrigins = [
  process.env.CLIENT_URL,            // your Vercel frontend
  "http://localhost:5173",           // local dev
  "http://localhost:3000",
];


const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // mobile apps, curl, etc.
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api", routes);



export default app;
