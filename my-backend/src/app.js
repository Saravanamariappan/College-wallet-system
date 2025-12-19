import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();   // ✅ FIRST initialize app

app.use(cors());
app.use(express.json());

// ✅ AFTER app is created
app.use("/api/auth", authRoutes);

export default app;
