require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

const apiRouter = express.Router();
apiRouter.use(cors("*"));
apiRouter.use(express.json());
apiRouter.use(bodyParser.urlencoded({extended: true}));

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
        await db.execute(sql, values, (err, result) => {
            if (err) {
                res.status(500).send("Error adding contact.");
            }
            res.status(201).send('Form data inserted!');
        });
    }
);

// Optional: quick health check
apiRouter.get('/health', (req, res) => res.json({ok: true}));

apiRouter.get('/products', (req, res) => {
    const sql = 'SELECT id, name, description, image_url, price FROM products';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Database error'});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({rows: result});
        }
    })
});

apiRouter.post("/cart", (req, res) => {
    const sql = "INSERT INTO cart(name, price, description, image_url) values (?, ?, ?, ?)"
    const {name, price, description, image_url} = req.body;
    db.execute(sql, [name, price, description, image_url], (err, result) => {
        if (err) {
            console.log("ERROR", err);
            res.status(500).json({error: "OH NO!!!"})
        }
        res.status(201).json({response: "Added to cart"});
    });
});

function getCart(res) {
    const sql = "select id, name, description, price, image_url from cart";
    db.execute(sql, (err, result) => {
        if (err) {
            console.error("OH NO", err);
            res.status(500).json({error: "Something horrible"});
        } else {
            console.log(result)
            res.status(200).json({rows: result});
        }
    })
}

apiRouter.get("/cart", (req, res) => {
    getCart(res);
})

apiRouter.delete("/cart/:id", (req, res) => {
    const sql = "delete from cart where id = (?)";
    db.execute(sql, [req.params.id], (err, result) => {
        getCart(res);
    })
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
