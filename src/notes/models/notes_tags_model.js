const { Schema, model, default: mongoose } = require("mongoose");

const TagSchema = new Schema(
    {
        // name of the tag
        name: String,
    },

);

module.exports = mongoose.model('Tags', TagSchema)