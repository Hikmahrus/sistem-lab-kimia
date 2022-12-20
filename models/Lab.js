const mongoose = require('mongoose')

const labSchema = new mongoose.Schema({
    nama : {
        type: String,
        required: true
    },
    nis: {
        type: Number,
        required: true
    },
    waktu: {
        type: String,
        required: true
    },
    lamaJam: {
        type: Number,
        required: true
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

module.exports = mongoose.model('Lab', labSchema)