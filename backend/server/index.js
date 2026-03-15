import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

// for accessing environment vars
dotenv.config();

const app = express();

app.use(cors());

// DB setup
// Database connection

const db = await mysql.createConnection({
  host: process.env.DB_HOST || "db", // Docker service name
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mealsdb",
  port: process.env.DB_PORT || 3306,
});

console.log("Connected to database");

// Ensure table exists
await db.execute(`
  CREATE TABLE IF NOT EXISTS meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log("Checked meals table exists");

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//   } else {
//     console.log("Connected to database");
//   }
// });

// Serve React build files
app.use(express.static(path.resolve("frontend/dist")));

const API_BASE_URL =
  process.env.API_BASE_URL || "https://jsonplaceholder.typicode.com";

app.get("/api/meals", async (req, res) => {
  try {
    // Check db first
    const [rows] = await db.query(
      "SELECT title, description FROM meals ORDER BY RAND() LIMIT 10",
    );

    if (rows.length > 0) {
      console.log("Serving meals from DB");
      return res.json(rows);
    }

    // If DB empty, then fetch from external API
    console.log("Fetching meals from API");

    const response = await fetch(`${API_BASE_URL}/posts?_limit=10`);
    const data = await response.json();

    const meals = data.map((post) => ({
      title: post.title,
      description: post.body,
    }));

    // Store in db
    for (const meal of meals) {
      await db.query("INSERT INTO meals (title, description) VALUES (?, ?)", [
        meal.title,
        meal.description,
      ]);
    }
    // Return the meals
    return res.json(meals);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to get meals" });
  }
});

// Serve React app for all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), "../frontend/dist/index.html"));
});

// Dyanmic port
const BACKEND_PORT = process.env.BACKEND_PORT || 3100;

app.listen(BACKEND_PORT, () =>
  console.log(`Proxy running on port ${BACKEND_PORT}`),
);
