const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

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

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/outdoor-adventure";
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.log(
      "Running without database - some features may be limited"
    );
    return false;
  }
};

const startServer = async () => {
  await connectDB();
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
