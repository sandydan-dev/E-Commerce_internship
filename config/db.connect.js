const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connection Established Successfully:", process.env.NODE_ENV);
    })
    .catch((error) => {
      console.log("Error connection to database", error);
    });
};

module.exports = connectDB;
