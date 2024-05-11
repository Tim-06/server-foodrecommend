const mongoose = require("mongoose");
const { Schema } = mongoose;

const customFoodSchema = new Schema({
  userEmail: { type: String, required: true },
  foods: [
    {
      foodName: { type: String, required: true, minlength: 1, maxlength: 20 },
      foodType: { type: String, required: true, minlength: 1, maxlength: 20 },
    },
  ],
});

module.exports = mongoose.model("CustomFood", customFoodSchema);
