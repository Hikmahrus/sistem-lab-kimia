const mongoose = require('mongoose')

const informasiSchema = new mongoose.Schema({
    nama : {
        type: String,
        required: true
    },
    waktu : {
        type: String,
        required: true
    },
    rutinitas : {
        type: Boolean,
        required: true
    },
    desc: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('Informasi', informasiSchema)