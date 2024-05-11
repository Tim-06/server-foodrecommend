const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 60,
  },
});

module.exports = mongoose.model("User", userSchema);
