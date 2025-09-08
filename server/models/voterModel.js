const  {Schema, model, Types} = require('mongoose')

const voterSchema = new Schema (
    {
        fullName: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true },
        votedElections: [{type: Types.ObjectId,ref:"Election", required: true}],
        isAdmin: {type: Boolean, default: false},
        municipality: { type: Types.ObjectId, ref: "Municipality", required: true }

    }, {timestamps: true}
)

module.exports = model('Voter', voterSchema)