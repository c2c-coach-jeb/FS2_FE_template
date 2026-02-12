require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Using mysql2 + dotenv
// TODO: Configure this pool with your schema credentials from Lesson 9.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// TODO: Implement /submit-form to handle form data and insert into your database
app.post('/contact', async (req, res) => {
  const formData = req.body;
  const sql = "INSERT INTO contacts (first_name, last_name, email, message) VALUES (?, ?, ?, ?)";
  const values = [formData.firstname, formData.lastname, formData.email, formData.subject];
  try {
    const result = await db.execute(sql, values);
    res.status(201).send('Form data inserted!');
  } catch (e) {
    console.error(e);
    res.status(500).send("Error adding contact.");
  }

});

// Optional: quick health check
app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/api/ecommerce/products', (req, res) => {
  const sql = 'SELECT * FROM products';

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
