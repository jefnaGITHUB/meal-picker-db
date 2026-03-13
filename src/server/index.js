import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

// for accessing environment vars
dotenv.config();

const app = express();

app.use(cors());

// Serve React build files
app.use(express.static(path.join(process.cwd(), "dist")));

const API_BASE_URL =
  process.env.API_BASE_URL || "https://jsonplaceholder.typicode.com";

app.get("/api/meals", async (req, res) => {
  const response = await fetch(`${API_BASE_URL}/posts?_limit=10`);

  const data = await response.json();

  console.log("response:", response.status);
  console.log("data:", data);

  const meals = data.map((post) => ({
    title: post.title,
    description: post.body,
  }));

  console.log("meals:", meals);

  return res.json(meals);
});

// Serve React app for all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

// Dyanmic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Proxy running on port 3000"));
