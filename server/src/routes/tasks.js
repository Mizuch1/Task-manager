
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    // In a more complete implementation, you would also fetch and attach assignees, comments, and history
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const taskResult = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    const task = taskResult.rows[0];

    // Fetch assigned users
    const assigneesResult = await db.query(
      `SELECT u.id, u.first_name, u.last_name FROM users u
       JOIN task_assignments ta ON u.id = ta.user_id
       WHERE ta.task_id = $1`,
      [id]
    );
    task.assignedTo = assigneesResult.rows.map(r => r.id);

    // Fetch comments
    const commentsResult = await db.query('SELECT * FROM comments WHERE task_id = $1 ORDER BY "timestamp" ASC', [id]);
    task.comments = commentsResult.rows;

    // Fetch history
    const historyResult = await db.query('SELECT * FROM task_history WHERE task_id = $1 ORDER BY "timestamp" ASC', [id]);
    task.history = historyResult.rows;

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST a new task
router.post('/', async (req, res) => {
    const { id, title, description, priority, category, dueDate, department, createdBy, assignedTo, beforeImageUrl } = req.body;
    try {
        const newTask = await db.query(
            `INSERT INTO tasks (id, title, description, priority, status, category, due_date, department, created_by, before_image_url, created_at)
             VALUES ($1, $2, $3, $4, 'À faire', $5, $6, $7, $8, $9, NOW()) RETURNING *`,
            [id, title, description, priority, category, dueDate, department, createdBy, beforeImageUrl]
        );

        const taskId = newTask.rows[0].id;

        // Insert into task_assignments
        for (const userId of assignedTo) {
            await db.query('INSERT INTO task_assignments (task_id, user_id) VALUES ($1, $2)', [taskId, userId]);
        }

        // Insert initial history
        await db.query(
            `INSERT INTO task_history (id, task_id, user_id, action, timestamp)
             VALUES ($1, $2, $3, 'Tâche créée', NOW())`,
            [`h-${Date.now()}`, taskId, createdBy]
        );

        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT (update) a task
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, status, category, dueDate, department, assignedTo, beforeImageUrl, afterImageUrl, completedAt, userId } = req.body;

    try {
        const updatedTask = await db.query(
            `UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4, category = $5, due_date = $6, department = $7, before_image_url = $8, after_image_url = $9, completed_at = $10
             WHERE id = $11 RETURNING *`,
            [title, description, priority, status, category, dueDate, department, beforeImageUrl, afterImageUrl, completedAt, id]
        );

        // Update assignments - simple way is to delete and re-insert
        await db.query('DELETE FROM task_assignments WHERE task_id = $1', [id]);
        for (const assigneeId of assignedTo) {
            await db.query('INSERT INTO task_assignments (task_id, user_id) VALUES ($1, $2)', [id, assigneeId]);
        }

        // Add history record
        await db.query(
            `INSERT INTO task_history (id, task_id, user_id, action, timestamp)
             VALUES ($1, $2, $3, 'Détails de la tâche mis à jour', NOW())`,
            [`h-${Date.now()}`, id, userId] // Assuming userId of updater is passed in body
        );

        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST a new comment
router.post('/:id/comments', async (req, res) => {
    const { id: taskId } = req.params;
    const { userId, text } = req.body;

    try {
        const newComment = await db.query(
            `INSERT INTO comments (id, task_id, user_id, text, timestamp)
             VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [`c-${Date.now()}`, taskId, userId, text]
        );

        // Add history record
        await db.query(
            `INSERT INTO task_history (id, task_id, user_id, action, timestamp)
             VALUES ($1, $2, $3, 'A ajouté un commentaire', NOW())`,
            [`h-${Date.now()}`, taskId, userId]
        );

        res.status(201).json(newComment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
