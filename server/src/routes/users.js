const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// POST login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Find user by email
    const { rows } = await db.query(
      'SELECT id, first_name, last_name, email, role, department, avatar_url, phone, password_hash FROM users WHERE email = $1', 
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const user = rows[0];

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Return user data (excluding password_hash)
    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, first_name, last_name, email, role, department, avatar_url, phone FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT id, first_name, last_name, email, role, department, avatar_url, phone FROM users WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
