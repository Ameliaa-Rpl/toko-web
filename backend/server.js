// backend/server.js (lengkap)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

require("./config/db");

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Static files untuk uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const usersRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

// Route sederhana
app.get("/", (req, res) => {
  res.send("API jalan");
});

// Jalankan server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});