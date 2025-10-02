
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3001;

// Add body parsing middleware with error handling BEFORE other middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Add error handling for JSON parsing (should be after body parsing)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err);
    return res.status(400).json({ msg: 'Invalid JSON format' });
  }
  next();
});

const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');

// A simple test route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// API routes
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
