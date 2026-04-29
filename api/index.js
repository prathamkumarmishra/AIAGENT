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

// Middleware to ensure DB connection before any API route
app.use("/api", async (req, res, next) => {
  // Skip DB connection for health check
  if (req.path === "/health" || req.path === "/") {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB Connection Middleware Error:", error.message);
    res.status(503).json({
      error: "Database connection failed",
      message: error.message,
    });
  }
});

// Other Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
        return callback(null, true);
      }
      // Allow all vercel.app subdomains
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
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

// Database connection is handled via middleware

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
