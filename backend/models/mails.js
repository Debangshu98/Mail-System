const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 👈 IMPORTANT
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 👈 IMPORTANT
  },
  subject: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model("Email", mailSchema);