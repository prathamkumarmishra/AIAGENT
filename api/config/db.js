const mongoose = require("mongoose");

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  // If already connected, reuse connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection attempt is in progress, wait for it
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  console.log("Connecting to MongoDB Atlas...");

  cached.promise = mongoose
    .connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false,
    })
    .then((conn) => {
      console.log(`✔ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((error) => {
      cached.promise = null; // Reset so next request retries
      console.error(`✘ MongoDB Connection Error: ${error.message}`);
      throw error;
    });

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
