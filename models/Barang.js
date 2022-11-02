const mongoose = require('mongoose')

const barangSchema = new mongoose.Schema({
    nama : {
        type: String,
        required: true
    },
    nis: {
        type: Number,
        required: true
    },
    namaBarang : {
        type: String,
        required: true
    },
    jumlah : {
        type: Number,
        required: true
    },
    waktuPeminjaman : {
        type: String,
        required: true
    },
    lamaHari : {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['Not yet verify' ,'Accepted', 'Declined'],
        default: 'Not yet verify'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Barang', barangSchema)