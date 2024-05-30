const mongoose = require("mongoose");
const config = require("../config/index");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
