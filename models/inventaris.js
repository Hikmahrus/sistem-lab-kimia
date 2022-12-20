const mongoose = require('mongoose')

const inventarisSchema = new mongoose.Schema({
    nama : {
        type: String,
        required: true
    },
    jumlah : {
        type: Number,
        required: true
    },
    kondisi : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Inventaris', inventarisSchema)