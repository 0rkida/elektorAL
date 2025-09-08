const { Schema, model } = require("mongoose");

const countySchema = new Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = model("County", countySchema);
