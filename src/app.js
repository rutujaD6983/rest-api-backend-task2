const express = require('express');
const { getDb, saveDb } = require('./db');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'REST API is running successfully!',
    endpoints: ['/api/health', '/api/items']
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running'
  });
});

// Get all items
app.get('/api/items', (req, res) => {
  try {
    const db = getDb();
    const result = db.exec('SELECT * FROM items');

    const items = result.length
      ? result[0].values.map(row => ({
          id: row[0],
          name: row[1],
          description: row[2]
        }))
      : [];

    res.json({ status: 'success', data: items });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Unable to fetch items'
    });
  }
});

// Get item by ID
app.get('/api/items/:id', (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid item ID'
      });
    }

    const db = getDb();
    const result = db.exec(
      'SELECT * FROM items WHERE id = ?',
      [id]
    );

    if (!result.length || !result[0].values.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found'
      });
    }

    const row = result[0].values[0];

    res.json({
      status: 'success',
      data: {
        id: row[0],
        name: row[1],
        description: row[2]
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Unable to fetch item'
    });
  }
});

// Create item
app.post('/api/items', (req, res) => {
  try {
    const { name, description = '' } = req.body || {};

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Name is required'
      });
    }

    if (typeof description !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Description must be text'
      });
    }

    const db = getDb();

    db.run(
      'INSERT INTO items (name, description) VALUES (?, ?)',
      [name.trim(), description.trim()]
    );

    const result = db.exec('SELECT last_insert_rowid()');

    saveDb();

    res.status(201).json({
      status: 'success',
      message: 'Item created successfully',
      id: result[0].values[0][0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Unable to create item'
    });
  }
});

// Update item
app.put('/api/items/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description = '' } = req.body || {};

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid item ID'
      });
    }

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        status: '400',
        message: 'Name is required'
      });
    }

    if (typeof description !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Description must be text'
      });
    }

    const db = getDb();
    const existing = db.exec(
      'SELECT id FROM items WHERE id = ?',
      [id]
    );

    if (!existing.length || !existing[0].values.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found'
      });
    }

    db.run(
      'UPDATE items SET name = ?, description = ? WHERE id = ?',
      [name.trim(), description.trim(), id]
    );

    saveDb();

    res.json({
      status: 'success',
      message: 'Item updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Unable to update item'
    });
  }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid item ID'
      });
    }

    const db = getDb();
    const existing = db.exec(
      'SELECT id FROM items WHERE id = ?',
      [id]
    );

    if (!existing.length || !existing[0].values.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found'
      });
    }

    db.run('DELETE FROM items WHERE id = ?', [id]);
    saveDb();

    res.json({
      status: 'success',
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Unable to delete item'
    });
  }
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

module.exports = app;
