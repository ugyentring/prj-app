import express from "express";
import dotenv from "dotenv";

import connectDB from "./DB/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
//continue from here with user routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
