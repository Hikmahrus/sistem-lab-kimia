const Informasi = require('../models/informasi')

const informasi = async (req, res) => {
    res.render('../views/informasi/informasi')
}

const indexInformasi = async (req, res) => {
    const user = await req.user
    const data = await Informasi.find().sort({createAt: 'desc'})
    res.render('../views/informasi/indexInformasi', {data: data, admin: (user != null)? user.role : 0, user: user})
}

const inputInformasi = async (req, res) => {
    const user = await req.user
    res.render('../views/informasi/inputInformasi', {user: user})
}

const insertInformasi = async (req, res) => {
    console.log(req.body.desc)
    const waktu = req.body.waktu
    const data = new Informasi({
        nama: req.body.nama,
        desc: req.body.desc,
    })
    try {
        await data.save()
        res.redirect('/input/informasi')
    } catch (error) {
        console.log(error)
    }
}

const detailInformasi = async (req, res) => {
    const user = await req.user
    const data = await Informasi.findById(req.params.id)
    res.render('../views/informasi/informasi', {data: data, user: user})
}

const editInformasi = async (req, res) => {
    const user = await req.user
    const data = await Informasi.findById(req.params.id)
    res.render('../views/informasi/editInformasi', {data: data, user: user})
}

const updateInformasi = async (req, res) => {
    const waktu = req.body.waktu
    const data = await Informasi.findById(req.params.id)
    data.nama = req.body.nama
    data.desc = req.body.desc
    try {
        await data.save()
        res.redirect('/index/informasi')
    } catch (error) {
        console.log(error)
    }
}

const removeInformasi = async (req, res) => {
    await Informasi.findByIdAndDelete(req.params.id)
    res.redirect('/index/informasi')
}

module.exports = {
    indexInformasi,
    inputInformasi,
    insertInformasi,
    editInformasi,
    updateInformasi,
    removeInformasi,
    informasi,
    detailInformasi,
}