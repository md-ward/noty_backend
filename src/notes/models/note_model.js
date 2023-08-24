const { Schema, model, default: mongoose } = require("mongoose");

const NoteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        // title of the note
        title: {
            type: Schema.Types.String,
            required: false


        },
        // text of the note
        text: {

            type: Schema.Types.String,
            required: true
        },
        // color of the note (e.g. blue, green, red)
        noteColor: {

            type: Schema.Types.String,
            required: false
        },
        // date the note was created
        createdAt: {

            type: Schema.Types.Date,
            required: true
        },
        // tags associated with the note (e.g. #work, #personal)
        tags: [{ type: String, ref: 'Tags' }],
    },

);


module.exports = mongoose.model('Note', NoteSchema);