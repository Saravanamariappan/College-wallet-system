import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create pool
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // add this if not present
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: true
  }
});

// Test connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ TiDB Connected Successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();