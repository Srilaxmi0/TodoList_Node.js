const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Reddy@123', // change if needed
  database: 'todo'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Default route
app.get('/', (req, res) => {
  res.send('To-Do App Server Running');
});

// Fetch all to-do items
app.get('/get-items', (req, res) => {
  db.query('SELECT * FROM todoItems', (err, results) => {
    if (err) {
      console.error('Failed to fetch items:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Add a new to-do item
app.post('/add-item', (req, res) => {
  const { itemDescription } = req.body;

  if (!itemDescription) {
    return res.status(400).send('Item description is required');
  }

  db.query(
    'INSERT INTO todoItems(itemDescription) VALUES(?)',
    [itemDescription],
    (err, results) => {
      if (err) {
        console.error('Error adding item:', err);
        return res.status(500).send('Failed to add item');
      }
      res.send('Item added successfully');
    }
  );
});

// Update an existing to-do item
app.put('/update-item/:id', (req, res) => {
  const { id } = req.params;
  const { itemDescription } = req.body;

  db.query(
    'UPDATE todoItems SET itemDescription = ? WHERE ID = ?',
    [itemDescription, id],
    (err, results) => {
      if (err) {
        console.error('Error updating item:', err);
        return res.status(500).send('Failed to update item');
      }
      res.send('Item updated successfully');
    }
  );
});

// Delete a to-do item
app.delete('/delete-item/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM todoItems WHERE ID = ?', [id], (err, results) => {
    if (err) {
      console.error('Error deleting item:', err);
      return res.status(500).send('Failed to delete item');
    }
    res.send('Item deleted successfully');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
