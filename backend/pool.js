
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST || "localhost";

const pool = mysql.createPool({
  host,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function waitForDB(maxRetry = 10, delayMs = 5000) {
  for (let i = 1; i <= maxRetry; i++) {
    try {
      console.log(`DB check attempt ${i}/${maxRetry} (host=${host})`);
      await pool.query("SELECT 1");
      console.log("Database is ready");
      return;
    } catch (err) {
      console.error(
        `DB not ready (attempt ${i}/${maxRetry}):`,
        err.message
      );

      if (i === maxRetry) {
        console.error(
          "DB is not ready "
        );
        return;
      }

      console.log(` retry in ${delayMs / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

waitForDB(); // เรียกแต่อย่า await ไว้ที่ top-level

export default pool;
