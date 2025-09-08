const  {Schema, model, Types} = require('mongoose')

const candidateSchema = new Schema({
    fullName: {type: String, required: true},
    image: {type: String, required: true},
    motto: {type: String, required: true},
    party: { type: String },
    voteCount: {type: Number, default: 0},
    election: {type: Types.ObjectId, required: true, ref: "Election"},
    municipality: { type: Types.ObjectId, ref: "Municipality", required: true }

})

module.exports = model("Candidate", candidateSchema)
