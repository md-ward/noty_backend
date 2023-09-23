const { Schema, default: mongoose } = require("mongoose");

const taskSchema = Schema({
    creatorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: Schema.Types.String,
        required: true
    },
    description: {
        type: Schema.Types.String
    },
    dueDate: {
        type: Schema.Types.Date
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team"
    },
    status: {
        type: Schema.Types.String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Task', taskSchema);