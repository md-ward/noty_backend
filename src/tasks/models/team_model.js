
const { Schema, default: mongoose } = require("mongoose");

const teamSchema = Schema({
    teamAdminId: {
        type: Schema.Types.String,
        required: true
        ,
        ref: 'User'

    },
    name: {
        type: Schema.Types.String,
        required: true
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model('Team', teamSchema);