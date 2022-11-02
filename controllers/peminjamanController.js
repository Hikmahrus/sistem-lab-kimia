const Lab = require('../models/Lab')
const Barang = require('../models/Barang')
const User = require('../models/user')

// --------------------- Admin ---------------------
const indexPengajuan = async (req, res) => {
    const user = await req.user
    // const lab = await Lab.find({ status: 'Not yet verify' }).sort({createAt: "desc"})
    // const barang = await Barang.find({ status: 'Not yet verify' }).sort({createAt: "desc"})
    /* 
        step :
        1. gabungkan lab dan barang menjadi satu objek
        2. beri pagination ke objek gabungan
    */
    const page = parseInt(req.query.page)
    const limit = 5 //default 5 lab + 5 barang ?

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const result = {}

    const labIndex = await Lab.countDocuments({ status: "Not yet verify" }).exec() 
    const barangIndex = await Barang.countDocuments({ status: "Not yet verify" }).exec()

    const maxIndex = (labIndex <= barangIndex) ? barangIndex : labIndex

    if (endIndex < maxIndex) {
        result.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        result.previous = {
            page: page - 1,
            limit: limit
        }
    }

    try {
        result.lab = await Lab.find({ status: "Not yet verify" }).sort({createAt: 'desc'}).limit(limit).skip(startIndex).exec()
        result.barang = await Barang.find({ status: "Not yet verify" }).sort({createAt: 'desc'}).limit(limit).skip(startIndex).exec()
    } catch (error) {
        console.log(error)
    }

    // console.log(result.result)
    res.render('../views/peminjaman/indexPengajuan', {user: user, data: result})
}

const acceptPengajuanLab = async (req, res) => {
    const data = await Lab.findById(req.params.id)
    data.status = 'Accepted'
    try {
        await data.save()
        res.redirect('/index/pengajuan?page=1')
    } catch (error) {
        console.log(error)
    }
}

const declinePengajuanLab = async (req, res) => {
    const data = await Lab.findById(req.params.id)
    data.status = 'Declined'
    try {
        await data.save()
        res.redirect('/index/pengajuan?page=1')
    } catch (error) {
        console.log(error)
    }
}

const acceptPengajuanBarang = async (req, res) => {
    const data = await Barang.findById(req.params.id)
    data.status = 'Accepted'
    try {
        await data.save()
        res.redirect('/index/pengajuan?page=1')
    } catch (error) {
        console.log(error)
    }
}

const declinePengajuanBarang = async (req, res) => {
    const data = await Barang.findById(req.params.id)
    data.status = 'Declined'
    try {
        await data.save()
        res.redirect('/index/pengajuan?page=1')
    } catch (error) {
        console.log(error)
    }
}

const detailsPengajuanBarang = async (req, res) => {
    const user = await req.user
    const data = await Barang.findById(req.params.id)
    const time = data.waktuPeminjaman.split(' ')
    res.render('../views/peminjaman/pesanpengajuanpeminjamanBarang', {data: data, time: time, user: user})
}

const detailsPengajuanLab = async (req, res) => {
    const user = await req.user
    const data = await Lab.findById(req.params.id)
    const time = data.waktu.split(' ')
    res.render('../views/peminjaman/pesanpengajuanpeminjamanLab', {data: data, time: time, user: user})
}

// const completePeminjaman = async (req, res) => {
//     const data = await Peminjaman.findById(req.params.id)
//     data.status = 'Finish'
//     try {
//         await data.save()
//         res.redirect('/history/peminjaman')
//     } catch (error) {
//         console.log(error)
//     }
// }

const historyPeminjamanLab = async (req, res) => {
    const user = await req.user
    // const data = await Lab.find({ status: {$ne: 'Not yet verify'}}) //status bukan "Not yet verivy"
    // const data = await Lab.find({ status: "Accepted"})

    const page = parseInt(req.query.page)
    const limit = 10 //default 10 ?

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const result = {}

    if (endIndex < await Lab.countDocuments({ status: "Accepted" }).exec()) {
        result.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        result.previous = {
            page: page - 1,
            limit: limit
        }
    }
    try {
        result.result = await Lab.find({ status: "Accepted" }).sort({createAt: 'desc'}).limit(limit).skip(startIndex).exec()
    } catch (error) {
        console.log(error)
    }
    res.render('../views/peminjaman/historyPeminjamanLab', {data: result, user: user})
}

const historyPeminjamanBarang = async (req, res) => {
    const user = await req.user
    // const data = await Barang.find({ status: "Accepted"})

    const page = parseInt(req.query.page)
    const limit = 10 //default 10 ?

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const result = {}

    if (endIndex < await Barang.countDocuments({ status: "Accepted" }).exec()) {
        result.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        result.previous = {
            page: page - 1,
            limit: limit
        }
    }
    try {
        result.result = await Barang.find({ status: "Accepted" }).sort({createAt: 'desc'}).limit(limit).skip(startIndex).exec()
    } catch (error) {
        console.log(error)
    }
    res.render('../views/peminjaman/historyPeminjamanBarang', {data: result, user: user})
}

const removePeminjamanBarang = async (req, res) => {
    await Barang.findByIdAndDelete(req.params.id)
    res.redirect('/history/peminjaman/barang?page=1')
}

const removePeminjamanLab = async (req, res) => {
    await Lab.findByIdAndDelete(req.params.id)
    res.redirect('/history/peminjaman/lab?page=1')
}

const removePengajuanBarang = async (req, res) => {
    await Barang.findByIdAndDelete(req.params.id)
    res.redirect('/index/pengajuan?page=1')
}

const removePengajuanLab= async (req, res) => {
    await Lab.findByIdAndDelete(req.params.id)
    res.redirect('/index/pengajuan?page=1')
}
// --------------------- User ---------------------

const pengajuanPeminjamanBarang = async (req, res) => {
    const user = await req.user
    res.render('../views/peminjaman/pengajuanPeminjamanBarang', { user: user})
}

const pengajuanPeminjamanLab = async (req, res) => {
    const user = await req.user
    res.render('../views/peminjaman/pengajuanPeminjamanLab', { user: (user) ? user : null})
}

const insertPengajuanLab = async (req, res) => {
    const waktu = req.body.waktu
    const data = new Lab({
        nama: req.body.nama,
        nis: req.body.nis,
        lamaJam: (Number(waktu[2].split(/[.:]/)[0]) == 0)? 12  - Number(waktu[1].split(/[.:]/)[0]): Number(waktu[2].split(/[.:]/)[0]) - Number(waktu[1].split(/[.:]/)[0]),
        waktu: waktu[0] + " , " + waktu[1] + " s.d " + waktu[2],
    })
    try {
        await data.save()
        res.redirect('/pengajuan/peminjaman/lab')
    } catch (error) {
        console.log(error)
    }
}

const insertPengajuanBarang = async (req, res) => {
    const user = await req.user
    const data = new Barang({
        nama: user.username,
        nis: user.nis,
        namaBarang : req.body.namaBarang,
        jumlah : req.body.jumlah,
        waktuPeminjaman : req.body.waktu + " s.d " + req.body.lama,
        lamaHari : req.body.lamahari
    })
    try {
        await data.save()
        res.redirect('/pengajuan/peminjaman/barang')
    } catch (error) {
        console.log(error)
    }
}

// const pengajuanUser = async (req, res) => {
//     const user = await req.user
//     const data = await Lab.find({ nis: user.nis})
//     res.render('../views/user/pengajuan', {data: data})
// }

// const indexUmum = async (req, res) => {
//     const data = await Lab.find({ status: "Accepted" })
//     res.render('../views/peminjaman/indexUmum', { data: data })
// }

module.exports = {
    indexPengajuan,
    insertPengajuanLab,
    insertPengajuanBarang,
    acceptPengajuanLab,
    acceptPengajuanBarang,
    declinePengajuanLab,
    declinePengajuanBarang,
    historyPeminjamanLab,
    historyPeminjamanBarang,
    pengajuanPeminjamanBarang,
    pengajuanPeminjamanLab,
    detailsPengajuanBarang,
    detailsPengajuanLab,
    removePeminjamanBarang,
    removePeminjamanLab,
    removePengajuanBarang,
    removePengajuanLab,
}