import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",   // unga MySQL password
  database: "college_wallet"
});

export default db;
