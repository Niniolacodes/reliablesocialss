const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'reliablesocials',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function createConnection() {
  const connection = await mysql.createConnection(DB_CONFIG);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS content_blocks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      payload JSON NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  return connection;
}

module.exports = { createConnection, DB_CONFIG };
