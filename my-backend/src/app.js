import express from "express";
import cors from "cors";

/* ROUTES */
import walletRoutes from "./routes/walletRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import studentRoutes from "./routes/student.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";

const app = express();

/* --------------------- MIDDLEWARES ----------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* --------------------- HEALTH CHECK ---------------------- */
app.get("/", (req, res) => {
  res.status(200).send("Backend is running 🚀");
});

/* --------------------- API ROUTES ------------------------ */

// WALLET ROUTES (balance, spend, etc.)
app.use("/api/wallet", walletRoutes);

// AUTH (login/register)
app.use("/api/auth", authRoutes);

// USERS CRUD
app.use("/api/users", userRoutes);

// ADMIN actions (register student/vendor, mint tokens)
app.use("/api/admin", adminRoutes);

// STUDENT actions (spend, check balance)
app.use("/api/students", studentRoutes);

// VENDOR actions (transactions)
app.use("/api/vendors", vendorRoutes);

// TRANSACTIONS history
app.use("/api/transactions", transactionRoutes);

/* --------------------- 404 HANDLER ----------------------- */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

/* --------------------- GLOBAL ERROR ----------------------- */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.message);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message,
  });
});

export default app;
