const mongoose = require("mongoose");
const { Schema } = mongoose;
const foodSchema = new Schema({
  foodName: { type: String, required: true, minlength: 1, maxlength: 20 },
  foodType: { type: String, required: true, minlength: 1, maxlength: 20 },
});
module.exports = mongoose.model("Food", foodSchema);
