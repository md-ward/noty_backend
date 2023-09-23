const { Schema, default: mongoose } = require("mongoose");


const userSchema = Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },

});



module.exports = mongoose.model('User', userSchema);