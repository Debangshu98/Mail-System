// db/connection.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://admin:admin1234@cluster0.tbddzox.mongodb.net/mail-system?retryWrites=true&w=majority"
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌ DB Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;