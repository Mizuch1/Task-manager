
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (!process.env.DATABASE_URL) {
    throw new Error('FATAL ERROR: DATABASE_URL is not defined in .env file');
}

module.exports = {
  query: (text, params) => pool.query(text, params),
};
