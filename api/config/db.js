const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in the environment variables");
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`\x1b[32m%s\x1b[0m`, `✔ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `✘ MongoDB Connection Error: ${error.message}`);
    
    if (error.message.includes("Authentication failed")) {
      console.warn(`\x1b[33m%s\x1b[0m`, `⚠ Tip: Check your username and password in the MONGODB_URI in .env`);
    }
    
    console.log("Running in limited mode without database access.");
    return null;
  }
};

module.exports = connectDB;
