const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const connectDB = require("./config/db");

const adventureRoutes = require("./routes/adventure");
const weatherRoutes = require("./routes/weather");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/adventures", adventureRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/auth", authRoutes);

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the Outdoor Adventure API!",
    healthCheck: "/api/health",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Outdoor Adventure API is running" });
});

// Connect to Database
connectDB();

const startServer = async () => {
  return app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
};


if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.app = app;
module.exports.connectDB = connectDB;
module.exports.startServer = startServer;
