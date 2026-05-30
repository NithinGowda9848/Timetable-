const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4 resolution first to avoid ECONNREFUSED issues on Windows
dns.setDefaultResultOrder('ipv4first');

/**
 * Connect to MongoDB.
 * Retrieves connection string from MONGODB_URI environment variable.
 */
async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
    const conn = await mongoose.connect(uri);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
