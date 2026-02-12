require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

const apiRouter = express.Router();
apiRouter.use(cors("*"));
apiRouter.use(express.json());
apiRouter.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRouter);

// ✅ Using mysql2 + dotenv
// TODO: Configure this pool with your schema credentials from Lesson 9.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// TODO: Implement /submit-form to handle form data and insert into your database
apiRouter.post('/contact', async (req, res) => {
  const formData = req.body;
  const sql = "INSERT INTO contacts (first_name, last_name, email, message) VALUES (?, ?, ?, ?)";
  const values = [formData.firstname, formData.lastname, formData.email, formData.subject];
  try {
    await db.execute(sql, values);
    res.status(201).send('Form data inserted!');
  } catch (e) {
    console.error(e);
    res.status(500).send("Error adding contact.");
  }

});

// Optional: quick health check
apiRouter.get('/health', (req, res) => res.json({ ok: true }));

apiRouter.get('/products', async (req, res) => {
  const sql = 'SELECT id, name, description, image_url, price FROM products';

  try {
    const [response] = await db.query(sql)
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({rows: response});
  } catch (e) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Database error' });
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
