import mysql from "mysql2/promise";

import "./config/loadEnv.js";

const db = mysql.createPool({
  host: process.env.DB_HOST || "187.127.131.17",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "career_user",
  password: process.env.DB_PASSWORD || "career4sl1234",
  database: process.env.DB_NAME || "db_4sl_career_plus",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0
});

export async function testDbConnection() {
  const connection = await db.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

export default db;
