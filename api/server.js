import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mysql from "mysql2"; 

import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// ---------------- Database Connection ----------------
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ---------------- ROUTES ----------------

// GET all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// POST new user
app.post("/users", (req, res) => {
  const { name, email, street, city, state, country, pincode } = req.body;

  const sql = `
    INSERT INTO users (name, email, street, city, state, country, pincode)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, street, city, state, country, pincode],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        id: result.insertId,
        name,
        email,
        street,
        city,
        state,
        country,
        pincode,
      });
    },
  );
});

// PUT update user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, street, city, state, country, pincode } = req.body;

  const sql = `
    UPDATE users 
    SET name=?, email=?, street=?, city=?, state=?, country=?, pincode=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, email, street, city, state, country, pincode, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User updated" });
    },
  );
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted" });
  });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
