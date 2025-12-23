const mysql = require('mysql2/promise');

const isDocker = process.env.NODE_ENV === 'docker';

const config = {
  host: process.env.DB_HOST || (isDocker ? "db" : "127.0.0.1"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "project_db",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

// ฟังก์ชัน retry จนกว่าจะ connect ได้
async function createPoolWithRetry(retries = 50, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(` Connecting to MySQL... (attempt ${i}/${retries})`);

      pool = mysql.createPool(config);

      // ทดลอง connection 1 ครั้ง
      const conn = await pool.getConnection();
      conn.release();

      console.log("Connected to MySQL database.");
      return pool;
    } catch (err) {
      console.log(`MySQL not ready: ${err.message}`);
      console.log(`Retrying in ${delay / 1000} seconds...\n`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.error("MySQL connection failed after maximum retries.");
  process.exit(1);
}

module.exports = createPoolWithRetry;