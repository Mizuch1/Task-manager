require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    const sqlFile = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await client.query(sqlFile);
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();
