require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

// ===============================
// APP INIT
// ===============================
const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());               // JSON body parser
app.use(express.urlencoded({ extended: true }));

// ===============================
// DATABASE CONNECTION (POOL)
// ===============================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ===============================
// TEST DB CONNECTION
// ===============================
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected");
  connection.release();
});

// ===============================
// ROUTES
// ===============================
app.use("/api/admin", require("./routes/admin.routes")(db));
app.use("/api/auth", require("./routes/auth.routes")(db));
app.use("/api/students", require("./routes/student.routes")(db));
app.use("/api/vendors", require("./routes/vendor.routes")(db));
app.use("/api/transactions", require("./routes/transaction.routes")(db));

// ===============================
// BASE ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("🎓 College Wallet System Backend Running");
});

// ===============================
// 404 HANDLER (MUST BE LAST)
// ===============================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===============================
// SERVER START
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
