import userRoutes from "./routes/userRoutes.js";

import express from "express";
import cors from "cors";


import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import studentRoutes from "./routes/student.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

/**
 * Root health check
 */
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

/**
 * Routes
 */
app.use("/api/users", userRoutes);


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/vendors", vendorRoutes);



export default app;
