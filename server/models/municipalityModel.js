const { Schema, model, Types } = require("mongoose");

const municipalitySchema = new Schema({
  name: { type: String, required: true },
  county: { type: Types.ObjectId, ref: "County", required: true }
});

module.exports = model("Municipality", municipalitySchema);
