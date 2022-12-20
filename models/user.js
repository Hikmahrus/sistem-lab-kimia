const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    nis : {
        type: Number,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    role: {
        type: Boolean, // 1 = admin, 0 = userrs
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)