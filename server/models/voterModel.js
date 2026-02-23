const { Schema, model } = require('mongoose');

const voterSchema = new Schema(
  {
    fullName: { type: String, required: true },
    idNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    votedElections: [{ type: Schema.Types.ObjectId, ref: "Election" }],
    isAdmin: { type: Boolean, default: false },
    county: {
    type: Schema.Types.ObjectId,
    ref: "County",
    required: true
  },
    dateOfBirth: {
    type: Date,
    required: true
  },
  
  municipality: {
    type: Schema.Types.ObjectId,
    ref: "Municipality",
    required: true
  }
  },
  { timestamps: true }
);

module.exports = model('Voter', voterSchema);
