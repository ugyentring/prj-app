import express from "express";
import dotenv from "dotenv";

import connectDB from "./DB/connectDB.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

//middleware
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
