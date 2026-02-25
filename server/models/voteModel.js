const { Schema, model, Types } = require("mongoose");

const voteSchema = new Schema({
  candidate: {
    type: Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  election: {
    type: Types.ObjectId,
    ref: "Election",
    required: true,
  },
  prevHash: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Vote", voteSchema);

